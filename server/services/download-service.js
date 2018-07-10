/* -----------------        download-service.js               ------------------

------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const util = require('util');

// Project Imports:
const cfg = require('../config').downloadService;
let db;  // this module-scope variable is set asynchronously from a promise in db-service.
require('./db-service').then(res => {db = res});

// Constants:
// TODO: put these in a config file
const SERVER_URL = 'http://localhost:3000';
const MIN_FIELD_LENGTH = 5; // min length of username, password and email
const MAX_FIELD_LENGTH = 30;

exports.deleteme = async function() {

};
