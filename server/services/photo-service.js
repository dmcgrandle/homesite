/* -----------------          photo-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const util = require('util');

// Project Imports:
const cfg = require('../config').photoService;
fileSvc = require('./file-service');

let db;
(async function() {
    let paths, files = [], albums = [];
// promise chain to run during init, building the albums and photo objects
// and storing them in the database for retrieval by the client via the api.
    require('./db-service')
    .then(res => {
        db = res; 
        return fileSvc.paths('images');
    })
    .then(res => {
        paths = res;
        return fileSvc.photoFiles('images');
    })
    .then(res => {
        files = res;
        albums = buildAlbums(paths, files);
        return exports.saveAlbumsToDB(albums);
    })
    .then(() => {
        console.log(Date(Date.now()) + ' : created new "albums" document in db.');
    })
    .catch(err => errAndExit(err, 1));
})();

exports.saveAlbumsToDB = async function (albums) {
    try { // TODO: update existing instead of wiping every time.
        if (0 != await db.collection('albums').find({_id : 0}).limit(1).count()) {// already exists
            await db.collection('albums').drop(); // wipe it out.
        }
        await db.collection('albums').insertMany(albums);    
    } catch (err) { errAndExit(err) };
}

exports.getAlbumById = async function (id) {
    if ((id < 0) || typeof(id) != 'number') throw new Error('404 Bad ID.');
    const album = await db.collection('albums').findOne({_id : id});
    if (!album) throw new Error('404 Unknown Album.');
    return album;
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
    for (var i=0;i<idsArray.length;i++) {
        pArray.push(db.collection('albums').findOne({_id : idsArray[i]}));
    }
    albums = await Promise.all(pArray);
    for (var i=0;i<idsArray.length;i++) {
        if (!albums[i]) // validity check
            throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
    }
    return albums;
}


buildAlbums = function(paths, files) {
    const PREFIX = '/protected/images/';
    let albums = [];
    let aIndex = 0; // albumIndex = album._id
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
    prevTargetAlbumPath = '';
    aIndex = targetAlbumIndex = prevTargetAlbumIndex = 0;
    // 3. Now build the photos array in each album that contains photos.
    files.forEach(file => {
        splitPaths = file.split('/');
        let photoName = splitPaths[splitPaths.length-1];
        let targetAlbumPath = file.slice(0,-(photoName.length+1));
        if (targetAlbumPath === prevTargetAlbumPath) {
            targetAlbumIndex = prevTargetAlbumIndex;
        } else { // first photo in a new album, so set up featuredPhoto(s)
            targetAlbumIndex = albums.findIndex(album => album.path === targetAlbumPath);
            albums[targetAlbumIndex].featuredPhoto = {
                filename: photoName, 
                fullpath: PREFIX + file, 
                caption: ''};
            splitPaths.pop(); // first, drop the filename 
            let numParents = splitPaths.length-1; 
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
                            fullpath: PREFIX + file, 
                            caption: ''};
                    }
                }
            }// end for
        }
        albums[targetAlbumIndex].photos.push({
            filename: photoName, 
            fullpath: PREFIX + file, 
            caption: '' }); // add photo to photos array
        prevTargetAlbumPath = targetAlbumPath;
        prevTargetAlbumIndex = targetAlbumIndex;
    });
    // root album featuredPhoto is not set by above code, so set it manually: first photo in root album
    albums[0].featuredPhoto = albums[0].photos[0];
    albums[0].name = 'All Photo Albums';
    return albums;
//    console.log('albums: ' + util.inspect(albums, {depth: 8, maxArrayLength: 300}));
};

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