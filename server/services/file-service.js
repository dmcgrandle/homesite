/* file-service.js - provides promise-based file and directory reading 
   services to various other modules in this project. */

// External Imports:
const fs = require('fs-extra');
const util = require('util');

const klaw = require('klaw');
const through2 = require('through2');

// Project Imports:
const cfg = require('../config').fileService;

// module-scope variables:
let fSvc = {};

const filterExcludeIfNotPhoto = through2.obj(function (item, enc, next) {
    if (item.stats.isFile() && isPhotoSuffix(item.path.substr(-4,4).toLowerCase())) { 
        this.push(item);
    }
    next();
});

const filterExcludeFiles = through2.obj(function (item, enc, next) {
    if (item.stats.isDirectory()) {
        this.push(item);
    }
    next();
});

fSvc.paths = function(path) {
    return new Promise( function(resolve, reject) {
        try {
            let items = [];
            klaw('./protected/' + path)
                .pipe(filterExcludeFiles)
                .on('data', item => items.push(stripPath(item, path)))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}
fSvc.photoFiles = function(path) {
    return new Promise( function(resolve, reject) {
        try {
            let items = []; 
            klaw('./protected/' + path)
                .pipe(filterExcludeIfNotPhoto)
                .on('data', item => items.push(stripPath(item, path)))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}

stripPath = function(item, path) {
    // strip out everything in path up to and including the 'dir' sent.
    return item.path.substr(item.path.search('protected/'+path)+11+path.length);
}

isPhotoSuffix = function(str) { //TODO: add more recognized picture formats
    return ((str == '.jpg') || (str == 'jpeg'))
};

//fSvc.items = items;

module.exports = fSvc;
