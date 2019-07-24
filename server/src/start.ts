/* 
  start.ts - entry point for homesite nodejs server.

  Begin by importing the config asynchronously and setting to a global var.  
  This is done via async imports so that webpack will code split and create the config 
  and key files as separate chunks so they can be modified by a user with particular 
  details later and loaded at runtime.

  The rest of this file is mostly standard boilerplate from the express generator.
 
*/

import { Config } from 'src/model';

import('./config')
  .then((importedAsyncFunc: any) => importedAsyncFunc.default)
  .then((importedConfig: Config) => {
    config = importedConfig;
  
    const server = require('./server');
    const debug = require('debug')('homesite:server');
    const http = require('http');
  
    /**
     * Get port from environment and store in Express.
     */
  
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
    httpServer.on('error', onError);
    httpServer.on('listening', onListening);
  
    /**
     * Normalize a port into a number, string, or false.
     */
  
    function normalizePort(val: string) {
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
  
    function onError(error: any) {
      if (error.syscall !== 'listen') {
        throw error;
      }
  
      const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
  
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
  
    function onListening() {
      const addr = httpServer.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
  });