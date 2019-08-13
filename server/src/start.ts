/* 
  start.ts - entry point for homesite nodejs server.

  Begin by importing the config asynchronously and setting to a global var.  
  This is done via async imports so that webpack will code split and create the config 
  and key files as separate chunks so they can be modified by a user with particular 
  details later and loaded at runtime.

  The rest of this file is mostly standard boilerplate from the express generator.

  TODO: Clean up all the linting exceptions from just importing a .js template.
 
*/

import { Config } from 'src/model';

import('./config')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((importedAsyncFunc: any): void => importedAsyncFunc.default)
    .then((importedConfig: Config | void): void => {
        if (importedConfig) {
            config = importedConfig; // set up global config variable
            console.log('config is now defined');
    
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const server = require('./server');
            const debug = require('debug')('homesite:server');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const http = require('http');
    
            /**
             * Get port from environment and store in Express.
             */
    
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const port = normalizePort(process.env.PORT || '3000');
            const app = server.Server.bootstrap().app;
            app.set('port', port);
    
            /**
             * Create HTTP server.
             */
    
            const httpServer = http.createServer(app);
    
            /**
             * Listen on provided port, on all network interfaces.
             */
    
            httpServer.listen(port);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            httpServer.on('error', onError);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            httpServer.on('listening', onListening);
    
            /**
             * Normalize a port into a number, string, or false.
             */
    
            function normalizePort(val: string): string | number | boolean {
                var port = parseInt(val, 10);
    
                if (isNaN(port)) {
                    // named pipe
                    return val;
                }
    
                if (port >= 0) {
                    // port number
                    return port;
                }
    
                return false;
            }
    
            /**
             * Event listener for HTTP server "error" event.
             */
    
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function onError(error: any): void {
                if (error.syscall !== 'listen') {
                    throw error;
                }
    
                const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    
                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        console.error(bind + ' requires elevated privileges');
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        console.error(bind + ' is already in use');
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            }
    
            /**
             * Event listener for HTTP server "listening" event.
             */
    
            function onListening(): void {
                const addr = httpServer.address();
                if (addr) {
                    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
                    debug('Listening on ' + bind);
                } else {
                    console.error('Error - address not set!');
                }
            }
    
        }
    });
