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
        item.path = item.path.substr(item.path.search(/protected/i)+9);
        this.push(item);
    }
    next();
});

const filterExcludeFiles = through2.obj(function (item, enc, next) {
    if (item.stats.isDirectory()) {
        // Give the path relative to /protected, not the whole path
        item.path = item.path.substr(item.path.search(/protected/i)+9);
        this.push(item);
    }
    next();
});

fSvc.dirs = function(dir) {
    return new Promise( function(resolve, reject) {
        try {
            let items = [];
            klaw('./protected/' + dir)
                .pipe(filterExcludeFiles)
                .on('data', item => items.push(item.path))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}
fSvc.photoFiles = function(dir) {
    return new Promise( function(resolve, reject) {
        try {
            let items = [];
            klaw('./protected/' + dir)
                .pipe(filterExcludeIfNotPhoto)
                .on('data', item => items.push(item.path))
                .on('end', () => resolve(items))
        } catch(err) {
            reject(err);
        }
    });
}

isPhotoSuffix = function(str) { //TODO: add more recognized picture formats
    return ((str == '.jpg') || (str == 'jpeg'))
};

//fSvc.items = items;

module.exports = fSvc;
