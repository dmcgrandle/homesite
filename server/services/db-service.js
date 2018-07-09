/* db-service.js - provides a single promise for the database connect variable
   "db" used in various other modules in this project to subscribe to. */

// External Imports:
const MongoClient = require('mongodb').MongoClient;

// Constants:
// TODO: put these in a config file
const DB_URL = 'mongodb://localhost:27017'
const DB_NAME = 'homesite';

// Note - this could have been set up using the async/wait notation like:
// database = async function() { client = await MongoClient.connect(... }
// but because of the need for a promise within a promise, I felt this
// method makes it more clear that this module returns a promise and
// exactly what it resolves to.

database = new Promise( function(resolve, reject) {
  try {
      MongoClient.connect(DB_URL).then(client => {
        console.log(Date(Date.now()) + ' : Connected to ' + DB_URL +
          ' using database "' + DB_NAME + '"');
        resolve(client.db(DB_NAME)); //this promise resolves to the db object
      });
  } catch(err) {
      reject(err);
  }
});

module.exports = database;
