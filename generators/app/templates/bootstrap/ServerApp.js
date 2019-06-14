'use strict'

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

exports.ServerApp = class {
  constructor (siteName) {
    Util.PrintTitle(`App Server Initializing [${process.env.NODE_ENV}] (${new Date().toLocaleTimeString()}) ...`)

    //= ==[ MAIN  APP ]===
    this.app = express()
    this.server = null
    this.env = process.env.NODE_ENV || 'development'
    this.redis = null

    this.app.locals.siteName = siteName || 'WebServer'
  }

  // ===[ Component Initializer Methods ]===
  SetLogging () {
    debug(`Initializing : Logging ...`)

    let accessLogStream = fs.createWriteStream(path.join(
      __dirname, '/logs/', this.app.locals.siteName, '_access ', (new Date()).toDateString(), '.log', {
        flags: 'a'
      }
    ))

    this.app.use(cors())
    this.app.use(morgan('dev'))
    this.app.use(morgan('short', {
      stream: accessLogStream
    }))
  }

  Headers () {
    debug(`Initializing : Content Headers ...`)

    this.app.use(
      helmet({
        noCache: true,
        referrerPolicy: true
      })
    )

    this.app.set('view engine', 'html')
    this.app.use(methodOverride('X-HTTP-Method')) //          Microsoft
    this.app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    this.app.use(methodOverride('X-Method-Override')) //      IBM
    this.app.use(bodyParser.json())
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    )
  }

  StaticServer () {
    debug(`Initializing : Static Server ...`)

    this.app.use(express.static(path.join(__dirname, '/public')))
  }

  SetupErrorStack () {
    debug(`Initializing : Error Stack ...`)
    this.app.use(
      errorhandler(Config.errorStack.options)
    )
    this.app.set('view options', {
      pretty: Config.errorStack.viewPretty
    })

    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found'
      })
    })
  }

  Authorization () {
    this.redis = require('redis').createClient(Config.redisPort, 'localhost')

    const rbac = require('./middleware/rbac')
    let passport = require('passport')

    const passportService = require('./middleware/passport')

    passport.use(passportService.jwtLogin)
    passport.use(passportService.localLogin)

    this.app.all('^/api/:params*', rbac.check)
  }

  BootstrapModels () {
    debug(`Bootstrapping : Models ...`)

    let modelsPath = path.join(__dirname, 'models')
    fs.readdirSync(modelsPath).forEach((file) => {
      require(modelsPath + '/' + file)
    })
  }

  BootstrapGlobalRoutes () {
    debug(`Bootstrapping : Global Routes ...`)

    let routesPath = path.join(__dirname, 'routes')
    fs.readdirSync(routesPath).forEach((file) => {
      this.app.use('/', require(routesPath + '/' + file))
    })
  }

  BootstrapAPI () {
    debug(`Bootstrapping : API ...`)

    let apiPath = path.join(__dirname, 'api')
    fs.readdirSync(apiPath).forEach((file) => {
      this.app.use('/api', require(apiPath + '/' + file))
    })
  }

  StartListening () {
    debug(`Instantiating : Restgoose Server ...`)
    this.server = this.app.listen(
      Config.address.serverPort,
      () => {
        debug(
          'Server: Express server listening at http://localhost:%d in %s mode',
          Config.address.serverPort,
          this.app.get('env')
        )
      }
    )
  }

  // ===[ Tools ]===
  gracefulShutdown () {
    debug('Server : Received kill signal, shutting down gracefully.')
    this.server.close(() => {
      debug('Server : Shutting down Express Services ... ok')
      debug('Server : Closed out remaining connections.')

      if (this.redis) {
        this.redis.quit()
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

  Stop (cb) {
    this.server.close(cb)
  }

  // ===[ Main Exports ]===
  ConnectDB () {
    return Util.ConnectDB()
  }

  StartServer (dbConData) {
    debug('DB : Database Connected : ' + dbConData)
    this.SetLogging()
    this.Headers()
    this.StaticServer()
    this.Authorization()
    this.BootstrapModels()
    this.BootstrapGlobalRoutes()
    this.BootstrapAPI()
    this.StartListening()
    this.SetupErrorStack()
    debug('[System] Everything is SETUP!')
  }
}
