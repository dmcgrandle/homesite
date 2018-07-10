/* -----------------          photo-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const util = require('util');

// Project Imports:
const cfg = require('../config').photoService;
fileSvc = require('./file-service');

let aIndex = 0;
let db, dirs, files, albums;
(async function() {
// promise chain to run during init, building the albums and photo objects
// and storing them in the database for retrieval by the client via the api.
    require('./db-service')
    .then(res => {
        db = res; 
        return fileSvc.dirs('images');
    })
    .then(res => {
        dirs = res;
        console.log('dirs: ' + util.inspect(dirs, {depth:10}));
        return fileSvc.photoFiles('images');
    })
    .then(res => {
        files = res;
        console.log('files: ' + util.inspect(files, {depth:10}));
        albums = makeAlbums(dirs, files);
    })
    .catch(err => errAndExit(err, 1));
})();

makeAlbums = function(dirs, files) {
    if (dirs.length > 1) {
        for (dir in dirs) {
            let album = {};
            album._id = aIndex++;
            album.path = dir;
            album.description = '';
            album.featuredPhoto = {filename: '', caption: ''};
            album.containsAlbums = (dirs.length > 1);
        }
    }
    else {

    }
};

errAndExit = function(err, code) {
    console.log(err);
    process.exit(code);
};