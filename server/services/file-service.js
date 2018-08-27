/* file-service.js - provides promise-based file and directory reading 
   services to various other modules in this project. */

// External Imports:
const fs = require('fs-extra');
const util = require('util');
//const path = require('path');

const klaw = require('klaw');
const through2 = require('through2');

// Project Imports:
const cfg = require('../config').fileService;

// module-scope variables:
let fSvc = {};

// Set up filters:

const filterExcludeIfNotMediaConstructor = function (testMediaFunc) {
    // Note - needs a function passed which will test for the media suffix that is passed
    return through2.obj(function (item, enc, next) {
        // Return true if file is a photo and not hidden or in a hidden dir
        if (item.stats.isFile() && !isHidden(item.path) && testMediaFunc(item.path.substr(-4,4).toLowerCase())) { 
            this.push(item);
        }
        next();
    });
}

// use the constructor form of through2 so we can call this same logic multiple times,
// creating a 'new' instance for each function we call it from.
const filterEFConstructor = through2.ctor({objectMode: true}, function (item, enc, next) {
    if (item.stats.isDirectory() && !isHidden(item.path)) {
        this.push(item);
    }
    next();
});

isHidden = function(path) { // Regex to test if there is a hidden directory or file in path
    return (/(^|\/)\.[^\/\.]/g).test(path);
};

fSvc.mediaDirs = function(topDir) {
    return new Promise( function(resolve, reject) {
        try {
            let items = [];
            const filterExcludeFiles = new filterEFConstructor();
            klaw('.' + topDir)
                .pipe(filterExcludeFiles)
                .on('data', item => {
//                    console.log('item is: ' + util.inspect(item, {maxDepth: 5}));
                    items.push(stripPath(item, topDir));
                })
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}

fSvc.mediaFiles = function(topDir, testMediaFunc) {
    // Note - testMediaFunc must be a test media function passed which will test for the correct 
    // file suffix. See function 'isPhotoSuffix' in media-service.js for example.
    return new Promise( function(resolve, reject) {
        try {
            let items = []; 
            const filterExcludeIfNotMedia = new filterExcludeIfNotMediaConstructor(testMediaFunc);
            klaw('.' + topDir)
                .pipe(filterExcludeIfNotMedia)
                .on('data', item => items.push(stripPath(item, topDir)))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}

fSvc.downloadFiles = function(dir, testFunc) {
    // This function reads all the files in 'dir' and returns a promise which will
    // resolve to an array of them, minus any hidden files, directories.  Also can
    // be further filtered by a passed 'testFunc'.
    return new Promise( function(resolve, reject) {
        fs.readdir('.' + dir)
            .then(files => filterDirsAndTestFunc('.' + dir, files, testFunc))
            .then(filteredFiles => resolve(filteredFiles))
            .catch(err => reject(err))
    });
};

fSvc.deleteFile = function(file) {
    return fs.unlink(file);
}

filterDirsAndTestFunc = async function(path, files, testFunc) {
    let newFileObjectArray = [];
    for (const file of files) {
        const s = await fs.stat(path+file);
        if (s.isFile() && (file[0] !== '.') && testFunc(file)) {
            newFileObjectArray.push({filename:file,size:s.size});
        }
    }
    return newFileObjectArray;
}

stripPath = function(item, topDir) {
    // strip out everything in path up to and including the 'topDir'.
    // Note: search will return -1 on top level directory itself.
    const s = item.path.search(topDir);
    return (s > 0) ? item.path.substr(s + topDir.length) : '';
}

module.exports = fSvc;
