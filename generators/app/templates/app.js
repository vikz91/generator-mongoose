'use strict';

// Module dependencies.
const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const cors = require('cors');
const debug = require('debug')('App');
const helmet = require('helmet');
const listEndpoints = require('express-list-endpoints');
const { Storage, Email, Payment, Security, Logger } = require('./plugins');

// const Config = require('../config')
const Util = require('./library').Util;
let Config = {};
module.exports = exports = class {
    constructor(siteName, config) {
        if (!config || !config.dir) {
            const msg =
                'App Configuration Not Provided. Server will terminate.';
            debug(msg);
            throw new Error(msg);
        }
        Config = config;

        //= ==[ MAIN  APP ]===
        this.app = express();
        this.app.locals.siteName = siteName || 'WebServer';

        this.server = null;
        this.env = process.env.NODE_ENV || 'development';
        this.redis = null;
        this.paths = Config.dir;
    }

    SetHealthCheck() {
        debug('Initializing : Health Checkup ...!');
        const serviceHealthChecks = ['mongodb', 'redisdb'];
        this.app.use(
            require('express-status-monitor')({
                title: `${Config.address.name} Status (v${Config.address.version})`,
                ignoreStartsWith: '/health',
                healthChecks: serviceHealthChecks.map(x => {
                    return {
                        protocol: 'http',
                        host: 'localhost',
                        path: `/api/health/check/${x}`,
                        port: `${Config.address.serverPort}`
                    };
                })
            })
        );
    }

    // ===[ Component Initializer Methods ]===
    Headers() {
        debug('Initializing : Content Headers ...');

        this.app.use(
            helmet({
                noCache: true,
                referrerPolicy: true
            })
        );

        this.app.use(cors());

        this.app.set('view engine', 'ejs');
        this.app.use(methodOverride('X-HTTP-Method')); //          Microsoft
        this.app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
        this.app.use(methodOverride('X-Method-Override')); //      IBM
        this.app.use(bodyParser.json());
        this.app.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
    }

    StaticServer() {
        debug('Initializing : Static Server ...');

        this.app.use(express.static(this.paths.static));
    }

    SetupErrorStack() {
        debug('Initializing : Error Stack ...');
        if (process.env.NODE_ENV !== 'production') {
            this.app.use(errorhandler(Config.errorStack.options));
        }
        this.app.set('view options', {
            pretty: Config.errorStack.viewPretty
        });

        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found'
            });
        });
    }

    Authorization(enabled) {
        enabled = !!enabled;
        debug(`Initializing : Authorization ... ${enabled}`);
        if (!enabled) {
            return;
        }
        this.redis = require('redis').createClient(
            Config.redis.port,
            Config.redis.host,
            Config.redis.opts
        );

        const rbac = require('./middleware/rbac');
        const passport = require('passport');

        const passportService = require('./middleware/passport');

        passport.use(passportService.jwtLogin);
        passport.use(passportService.localLogin);

        this.app.all('^/api/:params*', rbac.check);
    }

    ServicePlugins(enabled) {
        enabled = !!enabled;

        debug(`Configuring : Service Plugins ... ${enabled}`);
        if (!enabled) {
            return;
        }

        Storage.Init(Config.fileStorage);
        Email.Init(Config.mailService);
        Payment.Init(Config.payment);
        Security.Init(Config.security, this.app);
        Logger.Init(Config.logs, this.app);
    }

    BootstrapModels() {
        debug('Bootstrapping : Models ...');
        fs.readdirSync(this.paths.models).forEach(file => {
            require(this.paths.models + '/' + file);
        });
    }

    BootstrapAPI() {
        debug('Bootstrapping : API ...');

        fs.readdirSync(this.paths.api).forEach(file => {
            this.app.use('/api', require(this.paths.api + '/' + file));
        });
    }

    StartListening() {
        debug('Instantiating : Restgoose Server ...');
        this.server = this.app.listen(Config.address.serverPort, () => {
            debug(
                'Server: Express server listening at http://localhost:%d in %s mode\n',
                Config.address.serverPort,
                this.app.get('env')
            );
        });
    }

    ListEndpoints() {
        const data = listEndpoints(this.app);
        debug('\nENDPOINT LIST: ');
        debug(
            '%O',
            data.map(x => {
                return `[${x.methods.join(',')}]  ${x.path}`;
            })
        );
    }

    // ===[ Tools ]===
    gracefulShutdown(returnCode) {
        returnCode = returnCode || 0;
        debug('Server : Received kill signal, shutting down gracefully.');
        Util.CloseDB().then().catch(() => {
            process.exit(1);
        });
        if (this.redis) {
            this.redis.quit();
        }

        if (!this.server) {
            process.exit();
        }

        this.server.close(() => {
            debug('Server : Shutting down Express Services ... ok');
            debug('Server : Closed out remaining connections.');

            if (this.redis) {
                this.redis.quit();
            }
            process.exit(returnCode);
        });
        // setTimeout(function () {
        //     console.error(
        //         'Server : Could not close connections in time, forcefully shutting down'
        //     );
        //     process.exit();
        // }, 2 * 1000);
    }

    Stop(cb) {
        this.server.close(cb);
    }

    // ===[ Main Exports ]===
    StartServer() {
        const startTime = process.hrtime();
        let endTime = {};

        Util.ClearConsole();
        Util.PrintTitle(
            `App Server Initializing [${
            process.env.NODE_ENV
            }] (${new Date().toLocaleTimeString()}) ...`
        );

        return Util.ConnectDB(Config.db)
            .then(dbCon => {
                debug('DB : Database Connected : ' + dbCon);
                this.SetHealthCheck();
                this.Headers();
                this.StaticServer();
                this.Authorization(false);
                this.ServicePlugins(true);
                this.BootstrapModels();
                this.BootstrapAPI();
                this.SetupErrorStack();
                this.StartListening();
                endTime = process.hrtime(startTime);
                debug(
                    `[System] Everything is SETUP! (+${
                    endTime[0]
                    }s ${Math.round(endTime[1] / 1000000)}ms)`
                );
                Util.PrintTitle(
                    `App Server Started. [${process.env.NODE_ENV}]`
                );

                this.ListEndpoints();
            })
            .catch(dbErr => {
                Util.PrintTitle('Server Aborting due to Error!');
                debug('Server Error : %O', dbErr);
                this.gracefulShutdown(-1);
            });
    }
};
