/* config-service.js - provides a single promise for the config file read
   used in various other modules in this project to subscribe to. */

// External Imports:
const fs = require('fs-extra');
const jsmin = require('jsonminify'); //jsMinify to remove comments

// Constant:
const CONF_FILE = './config.json';

// wrap it in a new promise so we can jsMinify the raw config file.
module.exports = new Promise( function(resolve, reject) {
    try { fs.readFile(CONF_FILE, 'utf8').then(conf => resolve(jsmin(conf))) }
    catch(err) { reject(err) };
  });
