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

const filterExcludeIfNotPhoto = through2.obj(function (item, enc, next) {
    // Return true if file is a photo and not hidden or in a hidden dir
    if (item.stats.isFile() && !isHidden(item.path) && isPhotoSuffix(item.path.substr(-4,4).toLowerCase())) { 
        this.push(item);
    }
    next();
});

const filterExcludeFiles = through2.obj(function (item, enc, next) {
    if (item.stats.isDirectory() && !isHidden(item.path)) {
        this.push(item);
    }
    next(); 
});

isHidden = function(path) { // Regex to test if there is a hidden directory or file in path
    return (/(^|\/)\.[^\/\.]/g).test(path);
};

fSvc.photoDirs = function(topDir) {
    return new Promise( function(resolve, reject) {
        try {
            let items = [];
            klaw('.' + topDir)
                .pipe(filterExcludeFiles)
                .on('data', item => items.push(stripPath(item, topDir)))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}
fSvc.photoFiles = function(topDir) {
    return new Promise( function(resolve, reject) {
        try {
            let items = []; 
            klaw('.' + topDir)
                .pipe(filterExcludeIfNotPhoto)
                .on('data', item => items.push(stripPath(item, topDir)))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}

stripPath = function(item, topDir) {
    // strip out everything in path up to and including the 'topDir'.
    // Note: search will return -1 on top level directory itself.
    const s = item.path.search(topDir);
    return (s > 0) ? item.path.substr(s + topDir.length) : '';
}

isPhotoSuffix = function(str) { //TODO: add more recognized picture formats
    return ((str == '.jpg') || (str == 'jpeg'))
};

//fSvc.items = items;

module.exports = fSvc;
