'use strict'

process.stdout.write('\x1B[2J\x1B[0f')

// Module dependencies.
const express = require('express')
const path = require('path')
const fs = require('fs')
const methodOverride = require('method-override')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const cors = require('cors')
const debug = require('debug')('App')
const helmet = require('helmet')
const Config = require('./config')
const Util = require('./library/util')

const printTitle = title => {
  debug(' =============[ ' + title + ' ]=============')
}

printTitle(`App Server Starting [${process.env.NODE_ENV}] (${new Date().toLocaleTimeString()}) ...`)

//= ==[ MAIN  APP ]===
let app = (module.exports = exports.app = express())
let server = null
let env = process.env.NODE_ENV || 'development'
let redis = null

function SetLogging () {
  debug(`Initializing : Logging ...`)

  app.locals.siteName = '<%= capName %>'

  let accessLogStream = fs.createWriteStream(path.join(
    __dirname, '/logs/', app.locals.siteName, '_access ', (new Date()).toDateString(), '.log', {
      flags: 'a'
    }
  ))

  app.use(cors())
  app.use(morgan('dev'))
  app.use(morgan('short', {
    stream: accessLogStream
  }))
}

function Headers () {
  debug(`Initializing : Content Headers ...`)

  app.use(
    helmet({
      noCache: true,
      referrerPolicy: true
    })
  )

  app.set('view engine', 'html')
  app.use(methodOverride('X-HTTP-Method')) //          Microsoft
  app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
  app.use(methodOverride('X-Method-Override')) //      IBM
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
}

function StaticServer () {
  debug(`Initializing : Static Server ...`)

  app.use(express.static(path.join(__dirname, '/public')))
}

function SetupErrorStack () {
  debug(`Initializing : Error Stack ...`)

  if (env === 'development') {
    app.use(
      errorhandler({
        dumpExceptions: true,
        showStack: true
      })
    )
    app.set('view options', {
      pretty: true
    })
  }

  if (env === 'test') {
    app.set('view options', {
      pretty: true
    })
    app.use(
      errorhandler({
        dumpExceptions: true,
        showStack: true
      })
    )
  }

  if (env === 'production') {
    app.use(
      errorhandler({
        dumpExceptions: false,
        showStack: false
      })
    )
  }

  app.use(function (req, res) {
    res.status(404).json({
      error: 'Not Found'
    })
  })
}

function Authorization () {
  //  redis = require('redis').createClient(Config.redisPort, 'localhost');

  // const rbac = require('./middleware/rbac');
  // let passport = require('passport');

  // const passportService = require('./middleware/passport');

  // passport.use(passportService.jwtLogin);
  // passport.use(passportService.localLogin);

  // app.all('^/api/:params*', rbac.check);
}

function BootstrapModels () {
  debug(`Bootstrapping : Models ...`)

  let modelsPath = path.join(__dirname, 'models')
  fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file)
  })
}

function BootstrapGlobalRoutes () {
  debug(`Bootstrapping : Global Routes ...`)

  let routesPath = path.join(__dirname, 'routes')
  fs.readdirSync(routesPath).forEach(function (file) {
    app.use('/', require(routesPath + '/' + file))
  })
}

function BootstrapAPI () {
  debug(`Bootstrapping : API ...`)

  let apiPath = path.join(__dirname, 'api')
  fs.readdirSync(apiPath).forEach(function (file) {
    app.use('/api', require(apiPath + '/' + file))
  })
}

function StartListening () {
  debug(`Instantiating : Restgoose Server ...`)
  server = app.listen(
    Config.address.serverPort,
    () => {
      debug(
        'Server: Express server listening at http://localhost:%d in %s mode',
        Config.address.serverPort,
        app.get('env')
      )
    }
  )
}

function gracefulShutdown () {
  debug('Server : Received kill signal, shutting down gracefully.')
  server.close(function () {
    debug('Server : Shutting down Express Services ... ok')
    debug('Server : Closed out remaining connections.')

    if (redis) {
      redis.quit()
    }
    process.exit()
  })
  // setTimeout(function () {
  //     console.error(
  //         'Server : Could not close connections in time, forcefully shutting down'
  //     );
  //     process.exit();
  // }, 2 * 1000);
}

function stop (cb) {
  server.close(cb)
}

//= ==[ BOOTSTRAPING  APP ]===
Util.ConnectDB()
  .then(dbConData => {
    debug('DB : Database Connected : ' + dbConData)
    new SetLogging()
    new Headers()
    new StaticServer()
    new Authorization()
    new BootstrapModels()
    new BootstrapGlobalRoutes()
    new BootstrapAPI()
    new StartListening()
    new SetupErrorStack()
    debug('[System] Everything is SETUP!')
  })
  .catch(dbConErr => {
    debug('DB : Database Connection Error : ' + dbConErr)
    process.exit()
  })

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)

module.exports.stop = stop
