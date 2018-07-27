/* -----------------          photo-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const sharp = require('sharp');
const uniqueFilename = require('unique-filename');

// Project Imports:
const cfg = require('../config').photoService;
fileSvc = require('./file-service');

let db;
(async function() {
// setup to run during init, building the albums and photo objects and storing 
// them in the database for retrieval by the client via the api.
    try {
        db = await require('./db-service');
        const dirs = await fileSvc.photoDirs(cfg.PHOTO_DIR.PATH);
        const files = await fileSvc.photoFiles(cfg.PHOTO_DIR.PATH);
        await makeThumbsIfNeeded(files);
        const data = buildAlbumsAndPhotos(dirs, files);
        await saveDataToDB('photos', data.photos);
        await saveDataToDB('albums', data.albums);
        console.log(Date(Date.now()) + ' : created new "albums" document in db.');
    }
    catch(err) {errAndExit(err, 1)};
})();

saveDataToDB = async function (collection, data) {
    try { // TODO: update existing instead of wiping every time.
        if (0 != await db.collection(collection).find({_id : 0}).limit(1).count()) {// already exists
            await db.collection(collection).drop(); // wipe it out.
        }
        await db.collection(collection).insertMany(data);  
    } catch (err) { errAndExit(err) };
}

exports.getAlbumById = async function (id) {
    if ((id < 0) || typeof(id) != 'number') throw new Error('404 Bad ID.');
    const album = await db.collection('albums').findOne({_id : id});
    if (!album) throw new Error('404 Unknown Album.');
    return album;
}

exports.getPhotoById = async function (id) {
    if ((id < 0) || typeof(id) != 'number') throw new Error('404 Bad ID.');
    const photo = await db.collection('photos').findOne({_id : id});
    if (!photo) throw new Error('404 Unknown Photo id: ' + id);
    return photo;
}

exports.getAlbumByPath = async function (pathEncoded) {
    const path = pathEncoded.slice(1,-1).replace(/\+/g, '/');
    const album = await db.collection('albums').findOne({path : path});
    if (!album) throw new Error('404 Unknown Album: ' + path);
    return album;
}

exports.getAlbums = async function (albumIdsList) {
    const idsArray = albumIdsList.slice(1,-1).split('+').map(Number);
    let pArray = []; // set up promises array for all of the albums being requested
    for (let i=0;i<idsArray.length;i++) {
        pArray.push(db.collection('albums').findOne({_id : idsArray[i]}));
    }
    albums = await Promise.all(pArray);
    for (let i=0;i<idsArray.length;i++) {
        if (!albums[i]) // validity check
            throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
    }
    return albums;
};

exports.getPhotos = async function (photoIdsList) {
    const idsArray = photoIdsList.slice(1,-1).split('+').map(Number);
    let pArray = []; // set up promises array for all of the photos being requested
    for (let i=0;i<idsArray.length;i++) {
        pArray.push(db.collection('photos').findOne({_id : idsArray[i]}));
    }
    photos = await Promise.all(pArray);
    for (let i=0;i<idsArray.length;i++) {
        if (!photos[i]) // validity check
            throw new Error('403 Photo IDs list: ' + photoIdsList + ' is invalid.');
    }
    return photos;
};

exports.getThumbs = async function (photoIdsList) {
    const photos = await exports.getPhotos(photoIdsList);
    let thumbs = [];
    photos.forEach(photo => thumbs.push(photo.thumbPath)); 
    return thumbs;
};

makeThumbsIfNeeded = async function(files) { 
    // This function checks all files in the files array to see if
    // thumbnails already exist, and creates them if they do not.
    let pArray = []; //promise array to build
    for (let i=0;i<files.length;i++) {
        let thumb = getFullThumbPath(files[i]);
        pArray.push(fs.exists(thumb));
    }
    const thumbsExist = await Promise.all(pArray);
    pArray = []; //clear out the promise array & set up with thumb creations needed
    for (let i=0;i<files.length;i++) {
        if (!thumbsExist[i]) {
            const fileIn = path.join(__dirname, '..', cfg.PHOTO_DIR.PATH + files[i]);
            const fileOut = getFullThumbPath(files[i]);
            pArray.push(sharp(fileIn).resize(cfg.THUMBS.WIDTH).max().toFormat(cfg.THUMBS.FORMAT).toFile(fileOut));
        }
    }
    if (pArray.length > 0) {
        console.log(Date(Date.now()) + ' : About to create ' + pArray.length + ' thumbnails.  This could take a while...');
        await createSomeThumbs(pArray);
    }
}

createSomeThumbs = async function(thumbsRemaining) {
    // Need to limit the number of thumbs created silmultaneously due to memory and resource
    // issues.  Started to run into problems at more than 300 at a time, so I figure 50
    // should be a safe number for most environments.  Settable in config.js.
    // This needs to be a recursive function since we can't loop and call a promise.
    let numToDo = (thumbsRemaining.length > cfg.THUMBS.MAX_CREATE_AT_ONCE) 
       ? cfg.THUMBS.MAX_CREATE_AT_ONCE : thumbsRemaining.length;
    if (numToDo > 0) { // still have work to do
        let newPArray = []; 
        for (let i=0;i<numToDo;i++) {
            newPArray.push(thumbsRemaining.shift());
        }
        const thumbs = await Promise.all(newPArray);  // wait on creation of up to 50 items
        console.log(Date(Date.now()) + ' : Finished creating ' + numToDo + ' thumbnails.');
        if (thumbsRemaining.length > 0)
            createSomeThumbs(thumbsRemaining); // recurse for the remaining
    }
}

buildAlbumsAndPhotos = function(paths, files) {
//    const PREFIX = '/protected/images/'
    let albums = buildAlbumsArray(paths);
    let photos = buildPhotosArrays(albums, files);
    // root album featuredPhoto is not set by above code, so set it manually: first photo in root album
    albums[0].featuredPhoto = albums[0].photos[0];
    albums[0].name = 'All Photo Albums';
    return { albums: albums, photos: photos};
};

buildAlbumsArray = function(paths) {
    let albums = [];
    let aIndex = 0; // aIndex becomes album._id
    let splitPaths = [];
    let prevTargetAlbumPath = '';
    let prevTargetAlbumIndex = 0;
    paths.forEach(path => { // Create albums array of album objects
        // 1. First set up some default info for this album.
        // Three good things come from splitting the path: it makes stripping the last 
        // directory off the path easy for comparing this path to the previous one; 
        // the album.name is the last element in the split array; and finally it
        // allows us to quickly assemble all parents 
        splitPaths = path.split('/');
        let album = {};
        album._id = aIndex;
        album.name = splitPaths[splitPaths.length-1];
        album.path = path;
        album.description = '';
        album.featuredPhoto = {};
        album.photos = [];
        album.albums = [];
        albums[aIndex] = album;
        // 2. Now add this album's index (which equals it's _id) to it's parent's
        // albums array.
        targetAlbumPath = path.slice(0,-(splitPaths[splitPaths.length-1].length+1));
        targetAlbumIndex = ((targetAlbumPath === prevTargetAlbumPath) ? prevTargetAlbumIndex : 
            albums.findIndex(album => album.path === targetAlbumPath));
        albums[targetAlbumIndex].albums.push(aIndex); // add to proper albums array
        prevTargetAlbumPath = targetAlbumPath;
        prevTargetAlbumIndex = targetAlbumIndex;
        aIndex++;
    }); // end create albums array of album objects
    return albums;
}

buildPhotosArrays = function(albums, files) {
    // Builds the main photos array to be saved in the database, and also builds
    // the photos arrays that are stored within each album.
    prevTargetAlbumPath = '';
    let photos = [];
    fIndex = targetAlbumIndex = prevTargetAlbumIndex = 0; // fInxex == photo._id
    files.forEach(file => {
        splitPaths = file.split('/');
        let photoName = splitPaths[splitPaths.length-1];
        let photo = {};
        photo._id = fIndex;                  // id of this Photo
        photo.filename = photoName;          // filename without path
        photo.fullPath = cfg.PHOTO_DIR.PATH + file;  // full path and filename of photo
        photo.thumbPath = getRelativeThumbPath(file);
        //        photo.thumbPath = cfg.PHOTO_DIR.PATH + file; 
        // full path and filename of thumbnail - initial test set this same as fullPath ...
        photo.caption = '';                  // optional caption for photo
        let targetAlbumPath = file.slice(0,-(photoName.length+1));
        if (targetAlbumPath === prevTargetAlbumPath) {
            targetAlbumIndex = prevTargetAlbumIndex;
        } else { // first photo in a new album, so set up featuredPhoto
            targetAlbumIndex = albums.findIndex(album => album.path === targetAlbumPath);
            albums[targetAlbumIndex].featuredPhoto = {
                filename: photoName, 
                fullPath: cfg.PHOTO_DIR.PATH + file, 
                caption: ''};
            splitPaths.pop(); // first, drop the filename 
            const numParents = splitPaths.length-1; // have to save it since we mod splitPaths
            for (let i=0;i<numParents;i++) {// walk up the tree finding all parents
                splitPaths.pop(); // drop current album name to find the parent
                let parentAlbumPath = splitPaths.join('/');
                if (parentAlbumPath) {
                    // findIndex is potentially a time-intesive process which is why I tried to
                    // minimize as much as possible how often to do it.
                    parentAlbumIndex = albums.findIndex(album => album.path === parentAlbumPath);
                    if (isEmpty(albums[parentAlbumIndex].featuredPhoto)) {
                        albums[parentAlbumIndex].featuredPhoto = {
                            filename: photoName, 
                            fullPath: cfg.PHOTO_DIR.PATH + file, 
                            caption: ''};
                    }
                }
            }// end for (walking up the parent tree)
        } // end set up featuredPhoto
        albums[targetAlbumIndex].photos.push(fIndex); // add photo id to photos array
        prevTargetAlbumPath = targetAlbumPath;
        prevTargetAlbumIndex = targetAlbumIndex;
        photos.push(photo); // add photo to the photos array
        fIndex++;
    });
    return photos;
}

getFullThumbPath = function(file) {
    // Returns a fullPath to the thumbnail version of file
    return uniqueFilename(
        path.join(__dirname, '..', cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR), 
          cfg.THUMBS.PREFIX, file) + cfg.THUMBS.SUFFIX;
}

getRelativeThumbPath = function(file) {
    // Returns a valid web URL path for the client to retrieve the thumbnail
    return uniqueFilename(cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR, 
          cfg.THUMBS.PREFIX, file) + cfg.THUMBS.SUFFIX;
}

errAndExit = function(err, code) {
    console.log(err);
    process.exit(code);
};

isEmpty = function(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}