/* db-service.js - provides a single promise for the database connect variable
   "db" used in various other modules in this project to subscribe to. */

// External Imports:
// const mongoClient = require('mongodb').MongoClient;
import * as fs from 'fs-extra';
import { MongoClient, Db } from 'mongodb';

// let cfg: any;

// if (fs.existsSync('./config.js')) {
//   import('./config.js').then((importedCfg: any) => {
//     cfg = importedCfg.dbService;
//     console.log('cfg in token.service is ', cfg);
//   })
// }
// Project Imports:
// import config from '../config';
const cfg = config.dbService;

// Note - this could have been set up using the async/wait notation like:
// database = async function() { client = await MongoClient.connect(... }
// but because of the need for a promise within a promise, I felt this
// syntax makes it more clear that this module returns a promise and
// exactly what it resolves to.
export const database: Promise<Db> = new Promise((resolve, reject) => {
  MongoClient.connect(cfg.db_url, { useNewUrlParser: true })
    .then((client) => {
      console.log(Date.now() + ' : Connected to ' + cfg.db_url
        + ' using database "' + cfg.db_name + '"');
      resolve(client.db(cfg.db_name)); // this promise resolves to the db object
    })
    .catch(err => reject(err));
});

// module.exports = database;
