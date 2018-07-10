/* db-service.js - provides a single promise for the database connect variable
   "db" used in various other modules in this project to subscribe to. */

// External Imports:
const MongoClient = require('mongodb').MongoClient;

// Project Imports:
const cfg = require('../config').dbService;

// Note - this could have been set up using the async/wait notation like:
// database = async function() { client = await MongoClient.connect(... }
// but because of the need for a promise within a promise, I felt this
// method makes it more clear that this module returns a promise and
// exactly what it resolves to.
database = new Promise( function(resolve, reject) {
  try {
      MongoClient.connect(cfg.db_url).then(client => {
        console.log(Date(Date.now()) + ' : Connected to ' + cfg.db_url +
          ' using database "' + cfg.db_name + '"');
        resolve(client.db(cfg.db_name)); //this promise resolves to the db object
      });
  } catch(err) {
      reject(err);
  }
});

module.exports = database;
