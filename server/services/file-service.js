/* file-service.js - provides promise-based file and directory reading
   services to various other modules in this project. */

// External Imports:
const fs = require('fs-extra');
const klaw = require('klaw');
const through2 = require('through2');
const logFS = require('debug')('homesite:file-service');

// Project Imports:
// const cfg = require('../config').fileService;

// module-scope variables:
const fSvc = {};

// Set up filters:
function isHidden(path) { // Regex to test if there is a hidden directory or file in path
  /* eslint-disable-next-line no-useless-escape */ // Not useless in this case!
  return (/(^|\/)\.[^\/\.]/g).test(path);
}

// Note: about to disable lint checking of unnamed functions.  Inside through2 we need to
// push data 'this.push(item)' onto an object that is not exposed in the function, but part
// of the internal workings of through2 - accessed with the 'this' keyword bound to the internal
// object when the given function is added to that object before being called. This doesn't work
// in arrow functions so we have to use the old convention of unnamed non-arrow functions, thus
// disabling the linting of that for the next two function definitions.
/* eslint-disable func-names, prefer-arrow-callback */
const FilterExcludeIfNotMediaConstructor = function (testMediaFunc) {
  // Note - needs a function passed which will test for the media suffix that is passed
  return through2.obj(function (item, enc, next) {
    // Return true if file is a photo and not hidden or in a hidden dir
    if (item.stats.isFile() && !isHidden(item.path) && testMediaFunc(item.path.substr(-4, 4)
      .toLowerCase())) {
      this.push(item);
    }
    next();
  });
};

// use the constructor form of through2 so we can call this same logic multiple times,
// creating a 'new' instance for each function we call it from.
const FilterEFConstructor = through2.ctor({ objectMode: true }, function (item, enc, next) {
  if (item.stats.isDirectory() && !isHidden(item.path)) {
    this.push(item);
  }
  next();
});
/* eslint-enable func-names, prefer-arrow-callback */

function stripPath(item, topDir) {
  // strip out everything in path up to and including the 'topDir'.
  // Note: search will return -1 on top level directory itself.
  const s = item.path.search(topDir);
  return (s > 0) ? item.path.substr(s + topDir.length) : '';
}

async function filterDirsAndTestFunc(path, files, testFunc) {
  const newFileObjectArray = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    // Next line is inside a loop because setting up an array of promises could potentially
    // overwhelm the memory of systems in constrained environments. Resulting performance
    // degradation from doing each one-at-a-time appears to be minimal.
    /* eslint-disable-next-line no-await-in-loop */
    const s = await fs.stat(path + file);
    if (s.isFile() && (file[0] !== '.') && testFunc(file)) {
      newFileObjectArray.push({ filename: file, size: s.size });
    }
  }
  return newFileObjectArray;
}

fSvc.mediaDirs = topDir => new Promise((resolve, reject) => {
  try {
    const items = [];
    const filterExcludeFiles = new FilterEFConstructor();
    klaw('.' + topDir)
      .pipe(filterExcludeFiles)
      .on('data', (item) => {
        // console.log('item is: ' + util.inspect(item, {maxDepth: 5}));
        items.push(stripPath(item, topDir));
      })
      .on('end', () => resolve(items));
  } catch (err) {
    reject(err);
  }
});

fSvc.mediaFiles = (topDir, testMediaFunc) => new Promise((resolve, reject) => {
  // Note - testMediaFunc must be a test media function passed which will test for the correct
  // file suffix. See function 'isPhotoSuffix' in media-service.js for example.
  try {
    const items = [];
    const filterExcludeIfNotMedia = new FilterExcludeIfNotMediaConstructor(testMediaFunc);
    klaw('.' + topDir)
      .pipe(filterExcludeIfNotMedia)
      .on('data', item => items.push(stripPath(item, topDir)))
      .on('end', () => resolve(items));
  } catch (err) {
    reject(err);
  }
});

fSvc.downloadFiles = (dir, testFunc) => new Promise((resolve, reject) => {
  // This function reads all the files in 'dir' and returns a promise which will
  // resolve to an array of them, minus any hidden files, directories.  Also can
  // be further filtered by a passed 'testFunc'.
  fs.readdir('.' + dir)
    .then(files => filterDirsAndTestFunc('.' + dir, files, testFunc))
    .then(filteredFiles => resolve(filteredFiles))
    .catch(err => reject(err));
});

fSvc.deleteFile = file => fs.unlink(file);

fSvc.renameFile = (oldFile, newFile) => {
  logFS('Renaming file: "', oldFile, '" to be "', newFile, '"');
  return fs.rename(oldFile, newFile);
};

module.exports = fSvc;
