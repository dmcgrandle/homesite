/* -----------------          media-service.js                ------------------

------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const uniqueFilename = require('unique-filename');
const spawn = require('child_process').spawn;

// Project Imports:
const cfg = require('../config').mediaService;
const fileSvc = require('./file-service');
const dbSvc = require('./db-service');
const errSvc = require('./err-service');

/* eslint-disable no-use-before-define */ // Want to put this iife at top of file
let db;
(async () => {
  // setup to run during init, building the albums and media objects and storing
  // them in the database for retrieval by the client via the api.
  try {
    db = await dbSvc.database;
    console.log(Date(Date.now()) + ' : About to scan ' + cfg.PHOTO_DIR.PATH);
    const photoDirs = await fileSvc.mediaDirs(cfg.PHOTO_DIR.PATH);
    const photoFiles = await fileSvc.mediaFiles(cfg.PHOTO_DIR.PATH, isPhotoSuffix);
    console.log(Date(Date.now()) + ' : Done scanning ' + cfg.PHOTO_DIR.PATH);
    await makeThumbsIfNeeded(photoFiles);
    const photoData = buildPhotos(photoDirs, photoFiles);
    await saveDataToDB('photoAlbums', photoData.albums);
    await saveDataToDB('photos', photoData.photos);
    console.log(Date(Date.now()) + ' : created new "photoAlbums" document in db.');
    console.log(Date(Date.now()) + ' : About to scan ' + cfg.VIDEO_DIR.PATH);
    const videoDirs = await fileSvc.mediaDirs(cfg.VIDEO_DIR.PATH);
    const videoFiles = await fileSvc.mediaFiles(cfg.VIDEO_DIR.PATH, isVideoSuffix);
    console.log(Date(Date.now()) + ' : Done scanning ' + cfg.VIDEO_DIR.PATH);
    await makePostersIfNeeded(videoFiles);
    const videoData = buildVideos(videoDirs, videoFiles);
    await saveDataToDB('videoAlbums', videoData.albums);
    await saveDataToDB('videos', videoData.videos);
    console.log(Date(Date.now()) + ' : created new "videoAlbums" document in db.');
  } catch (err) { errSvc.errAndExit(err, 1); }
})();
/* eslint-enable no-use-before-define */

// ----------------------------
// Module's Internal functions:

async function saveDataToDB(collection, data) {
  try { // TODO: update existing instead of wiping every time.
    if (await db.collection(collection).find({ _id: 0 }).limit(1).count() !== 0) { // already exists
      await db.collection(collection).drop(); // wipe it out.
    }
    await db.collection(collection).insertMany(data);
  } catch (err) { errSvc.errAndExit(err); }
}

function getFullThumbPath(file) {
  // Returns a fullPath to the thumbnail version of file
  return uniqueFilename(path.join(__dirname, '..', cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR),
    cfg.THUMBS.PREFIX, file) + cfg.THUMBS.SUFFIX;
}

async function createSomeThumbs(thumbsRemaining) {
  // Need to limit the number of thumbs created silmultaneously due to memory and resource
  // issues.  Started to run into problems at more than 300 at a time, so I figure 50
  // should be a safe number for most environments.  Settable in config.js.
  const numToDo = (thumbsRemaining.length > cfg.THUMBS.MAX_CREATE_AT_ONCE)
    ? cfg.THUMBS.MAX_CREATE_AT_ONCE : thumbsRemaining.length;
  if (numToDo > 0) { // still have work to do
    const newPArray = [];
    for (let i = 0; i < numToDo; i += 1) {
      newPArray.push(thumbsRemaining.shift());
    }
    await Promise.all(newPArray); // wait on creation of up to MAX items
    console.log(Date(Date.now()) + ' : Finished creating ' + numToDo + ' thumbnails.');
    if (thumbsRemaining.length > 0) await createSomeThumbs(thumbsRemaining); // recurse remaining
  }
}

async function makeThumbsIfNeeded(files) {
  // This function checks all files in the files array to see if
  // thumbnails already exist, and creates them if they do not.
  await fs.ensureDir(path.join(__dirname, '..', cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR));
  let pArray = []; // promise array to build
  for (let i = 0; i < files.length; i += 1) {
    const thumb = getFullThumbPath(files[i]);
    pArray.push(fs.exists(thumb));
  }
  const thumbsExist = await Promise.all(pArray);
  pArray = []; // clear out the promise array & set up with thumb creations needed
  for (let i = 0; i < files.length; i += 1) {
    if (!thumbsExist[i]) {
      const fileIn = path.join(__dirname, '..', cfg.PHOTO_DIR.PATH + files[i]);
      const fileOut = getFullThumbPath(files[i]);
      pArray.push(sharp(fileIn).resize(cfg.THUMBS.WIDTH).max().toFormat(cfg.THUMBS.FORMAT)
        .toFile(fileOut));
    }
  }
  if (pArray.length > 0) {
    console.log(Date(Date.now()) + ' : About to create ' + pArray.length
      + ' thumbnails.  This could take a while...');
    await createSomeThumbs(pArray);
  }
}

function getFullPosterPath(file) {
  // Returns a fullPath to the thumbnail version of file
  return uniqueFilename(path.join(__dirname, '..', cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR),
    cfg.POSTERS.PREFIX, file) + cfg.POSTERS.SUFFIX;
}

function ffmpegPromise(...args) {
  // This "promisifies" the spawn function call to ffmpeg.  Needed to write my own
  // rather than using a generic one such as 'child-process-es6-promise' because
  // ffmpeg throws info into stderr instead of stdout even if it's not an error,
  // so I check the return code too.
  const name = args[0];
  const ffArgs = args[1];
  const options = args[2];
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(name, ffArgs, options);
    let dataOut = ''; // buffer results sent
    let dataErr = '';
    ffmpeg.stdout.on('data', (data) => { dataOut += data; });
    ffmpeg.stderr.on('data', (data) => { dataErr += data; });
    ffmpeg.on('close', (returnCode) => {
      if (dataErr && (returnCode !== 0)) {
        console.log('ffmpegPromise Error! Return code is: ' + returnCode);
        reject(dataErr);
      } else {
        resolve(dataOut);
      }
    });
    ffmpeg.on('error', err => reject(err));
  });
}

async function createSomePosters(postersRemaining) {
  // Need to limit the number of posters created silmultaneously due to memory and resource
  // issues. Instead of doing the thumbExists check, then setting up the whole promise array,
  // then executing it a batch at a time, this time we are doing the check, the promise array
  // setup and 'await Promise.all' if needed all in the same batch.
  const numToDo = (postersRemaining.length > cfg.POSTERS.MAX_CREATE_AT_ONCE)
    ? cfg.POSTERS.MAX_CREATE_AT_ONCE : postersRemaining.length;
  if (numToDo > 0) { // still have work to do
    let pArray = []; // promise array to build
    for (let i = 0; i < numToDo; i += 1) {
      pArray.push(fs.exists(getFullPosterPath(postersRemaining[i])));
    } // first, check to see if the posters already exist.  Queue up MAX_CREATE_AT_ONCE of them.
    try {
      const postersExist = await Promise.all(pArray);
      pArray = [];
      for (let i = 0; i < numToDo; i += 1) {
        if (!postersExist[i]) {
          const fileIn = path.join(__dirname, '..', cfg.VIDEO_DIR.PATH + postersRemaining[0]);
          const fileOut = getFullPosterPath(postersRemaining[0]);
          pArray.push(ffmpegPromise('ffmpeg', ['-ss', '00:00:00', '-i', fileIn, '-vframes', '1',
            '-q:v', '2', '-vf', 'scale=' + cfg.POSTERS.WIDTH + ':-1', fileOut]));
        }
        postersRemaining.shift(); // drop the first item in the array.
      }
      if (pArray.length > 0) {
        console.log(Date(Date.now()) + ' : Creating ' + pArray.length + ' posters...');
        await Promise.all(pArray);
      }
    } catch (err) { errSvc.errAndExit(err, 1); }
    if (postersRemaining.length > 0) {
      try {
        await createSomePosters(postersRemaining); // recurse for the remaining
      } catch (err) { errSvc.errAndExit(err, 1); }
    }
  }
}

async function makePostersIfNeeded(files) {
  // Doing this differently than creating thumbs, since we are dealing with streams and
  // events with spawn of a child process for every ffmpeg call.  With spawn it starts
  // executing as soon as it is set up, so need to handle it differently than 'sharp'.
  try {
    await fs.ensureDir(path.join(__dirname, '..', cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR));
    const posterFiles = files.slice(); // clone the files array since we'll be modifying it
    console.log(Date(Date.now()) + ' : Found ' + posterFiles.length + ' videos.  Will create posters if needed.');
    await createSomePosters(posterFiles);
  } catch (err) { errSvc.errAndExit(err, 1); }
}

function buildAlbumsArray(paths, media) {
  const albums = [];
  let aIndex = 0; // aIndex becomes album._id
  let splitPaths = [];
  let prevTargetAlbumPath = '';
  let prevTargetAlbumIndex = 0;
  paths.forEach((fullPath) => { // Create albums array of album objects
    // 1. First set up some default info for this album.
    // Three good things come from splitting the path: it makes stripping the last
    // directory off the path easy for comparing this path to the previous one;
    // the album.name is the last element in the split array; and finally it
    // allows us to quickly assemble all parents
    splitPaths = fullPath.split('/');
    const album = {};
    album._id = aIndex;
    album.name = splitPaths[splitPaths.length - 1];
    album.path = fullPath;
    album.description = '';
    album.featuredMedia = {};
    album[media + 'Ids'] = [];
    album.albumIds = [];
    albums[aIndex] = album;
    // 2. Now add this album's index (which equals it's _id) to it's parent's
    // albums array.
    const targetAlbumPath = fullPath.slice(0, -(splitPaths[splitPaths.length - 1].length + 1));
    const targetAlbumIndex = ((targetAlbumPath === prevTargetAlbumPath) ? prevTargetAlbumIndex
      : albums.findIndex(testAlbum => testAlbum.path === targetAlbumPath));
    if (aIndex > 0) albums[targetAlbumIndex].albumIds.push(aIndex); // add to proper albumIds array
    prevTargetAlbumPath = targetAlbumPath;
    prevTargetAlbumIndex = targetAlbumIndex;
    aIndex += 1;
  }); // end create albums array of album objects
  return albums;
}

function getRelTorPPath(file, mediaType) { // Get Relative Thumb or Poster Path
  // Returns a valid web URL path for the client to retrieve the thumbnail
  let url = '';
  if (mediaType === 'photo') {
    url = uniqueFilename(cfg.PHOTO_DIR.PATH + cfg.PHOTO_DIR.CACHE_DIR, cfg.THUMBS.PREFIX, file)
      + cfg.THUMBS.SUFFIX;
  } else { // mediaType === 'video
    url = uniqueFilename(cfg.VIDEO_DIR.PATH + cfg.VIDEO_DIR.CACHE_DIR, cfg.POSTERS.PREFIX, file)
      + cfg.POSTERS.SUFFIX;
  }
  return url;
}

/* eslint-disable */ // I know this function is ugly.  TODO - find a better way to test this.
function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
/* eslint-enable */

/* eslint-disable no-param-reassign */
// TODO - Currently being lazy by modifying albums parameter. Fix this.
function buildMediaArray(albums, files, mediaType) {
  // Builds the main photos array to be saved in the database, and also builds
  // the photos arrays that are stored within each album.
  let prevTargetAlbumPath = '';
  const medias = [];
  const thumbPathKey = ((mediaType === 'photo') ? 'thumb' : 'poster') + 'Path';
  let fIndex = 0; // fInxex == photo._id
  let targetAlbumIndex = 0;
  let prevTargetAlbumIndex = 0;
  files.forEach((file) => {
    const splitPaths = file.split('/');
    const mediaFilename = splitPaths[splitPaths.length - 1];
    const mediaFullPath = cfg[mediaType.toUpperCase() + '_DIR'].PATH + file;
    const media = {};
    media._id = fIndex; // id of this Photo
    media.filename = mediaFilename; // filename without path
    media.fullPath = mediaFullPath; // full path and filename of media
    // path and filename of thumbnail relative to root URL
    const thumbPath = getRelTorPPath(file, mediaType);
    media[thumbPathKey] = thumbPath;
    media.caption = ''; // optional caption for photo
    const targetAlbumPath = file.slice(0, -(mediaFilename.length + 1));
    if (targetAlbumPath === prevTargetAlbumPath) {
      targetAlbumIndex = prevTargetAlbumIndex;
    } else { // first photo in a new album, so set up featuredMedia
      targetAlbumIndex = albums.findIndex(album => album.path === targetAlbumPath);
      albums[targetAlbumIndex].featuredMedia = {
        filename: mediaFilename,
        fullPath: mediaFullPath,
        caption: '',
      };
      albums[targetAlbumIndex].featuredMedia[thumbPathKey] = thumbPath;
      splitPaths.pop(); // first, drop the filename
      const numParents = splitPaths.length - 1; // have to save it since we mod splitPaths
      for (let i = 0; i < numParents; i += 1) { // walk up the tree finding all parents
        splitPaths.pop(); // drop current album name to find the parent
        const parentAlbumPath = splitPaths.join('/');
        if (parentAlbumPath) {
          const parentAlbumIndex = albums.findIndex(album => album.path === parentAlbumPath);
          if (isEmpty(albums[parentAlbumIndex].featuredMedia)) {
            albums[parentAlbumIndex].featuredMedia = {
              filename: mediaFilename,
              fullPath: mediaFullPath,
              caption: '',
            };
            albums[parentAlbumIndex].featuredMedia[thumbPathKey] = thumbPath;
          }
        }
      }// end for (walking up the parent tree)
    } // end set up featuredMedia
    albums[targetAlbumIndex][mediaType + 'Ids'].push(fIndex); // eg: add photo id to photos array
    medias.push(media); // eg: add photo to the photos array
    // set up indexes for next iteration of loop:
    prevTargetAlbumPath = targetAlbumPath;
    prevTargetAlbumIndex = targetAlbumIndex;
    fIndex += 1;
  });
  return medias;
}
/* eslint-enable no-param-reassign */

function buildVideos(paths, files) {
  //    const PREFIX = '/protected/videos/'
  const newAlbums = buildAlbumsArray(paths, 'video');
  const newVideos = buildMediaArray(newAlbums, files, 'video');
  newAlbums[0].featuredMedia = {
    filename: newVideos[0].filename,
    fullPath: newVideos[0].fullPath,
    caption: '',
  };
  newAlbums[0].name = 'Root Video Album';
  return { albums: newAlbums, videos: newVideos };
}

function buildPhotos(paths, files) {
  //    const PREFIX = '/protected/images/'
  const newAlbums = buildAlbumsArray(paths, 'photo');
  const newPhotos = buildMediaArray(newAlbums, files, 'photo');
  // root album featuredMedia is not set by above code, so set it manually to the first photo
  newAlbums[0].featuredMedia = {
    filename: newPhotos[0].filename,
    fullPath: newPhotos[0].fullPath,
    caption: '',
  };
  newAlbums[0].name = 'Root Photo Album';
  return { albums: newAlbums, photos: newPhotos };
}

function isPhotoSuffix(str) { // TODO: add more recognized picture formats
  return ((str === '.jpg') || (str === 'jpeg'));
}

function isVideoSuffix(str) { // TODO: add more recognized video formats
  return ((str === '.mp4') || (str === '.mov'));
}

// -------------------
// Exported functions:

exports.getPhotoAlbumById = async (id) => {
  if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
  const album = await db.collection('photoAlbums').findOne({ _id: id });
  if (!album) throw new Error('404 Unknown Album.');
  return album;
};

exports.getPhotoById = async (id) => {
  if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
  const photo = await db.collection('photos').findOne({ _id: id });
  if (!photo) throw new Error('404 Unknown Photo id: ' + id);
  return photo;
};

exports.getVideoById = async (id) => {
  if ((id < 0) || typeof (id) !== 'number') throw new Error('404 Bad ID.');
  const video = await db.collection('videos').findOne({ _id: id });
  if (!video) throw new Error('404 Unknown Video id: ' + id);
  return video;
};

exports.getPhotoAlbumByPath = async (pathEncoded) => {
  const thisPath = pathEncoded.slice(1, -1).replace(/\+/g, '/');
  const album = await db.collection('photoAlbums').findOne({ path: thisPath });
  if (!album) throw new Error('404 Unknown Album: ' + thisPath);
  return album;
};

exports.getPhotoAlbums = async (albumIdsList) => {
  const idsArray = albumIdsList.slice(1, -1).split('+').map(Number);
  const pArray = []; // set up promises array for all of the albums being requested
  for (let i = 0; i < idsArray.length; i += 1) {
    pArray.push(db.collection('photoAlbums').findOne({ _id: idsArray[i] }));
  }
  const albums = await Promise.all(pArray);
  for (let i = 0; i < idsArray.length; i += 1) {
    if (!albums[i]) { // validity check
      throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
    }
  }
  return albums;
};

exports.getPhotos = async (photoIds) => {
  const idsArray = photoIds.slice(1, -1).split('+').map(Number);
  const pArray = []; // set up promises array for all of the photos being requested
  for (let i = 0; i < idsArray.length; i += 1) {
    pArray.push(db.collection('photos').findOne({ _id: idsArray[i] }));
  }
  const photos = await Promise.all(pArray);
  for (let i = 0; i < idsArray.length; i += 1) {
    if (!photos[i]) { // validity check
      throw new Error('403 Photo IDs list: ' + photoIds + ' is invalid.');
    }
  }
  return photos;
};

exports.getVideos = async (videoIds) => {
  const idsArray = videoIds.slice(1, -1).split('+').map(Number);
  const pArray = []; // set up promises array for all of the videos being requested
  for (let i = 0; i < idsArray.length; i += 1) {
    pArray.push(db.collection('videos').findOne({ _id: idsArray[i] }));
  }
  const videos = await Promise.all(pArray);
  for (let i = 0; i < idsArray.length; i += 1) {
    if (!videos[i]) { // validity check
      throw new Error('403 Video IDs list: ' + videoIds + ' is invalid.');
    }
  }
  return videos;
};

exports.getThumbs = async (photoIdsList) => {
  const photos = await exports.getPhotos(photoIdsList);
  const thumbs = [];
  photos.forEach(photo => thumbs.push(photo.thumbPath));
  return thumbs;
};

exports.getPosters = async (posterIds) => {
  const videos = await exports.getVideos(posterIds);
  const posters = [];
  videos.forEach(video => posters.push(video.posterPath));
  return posters;
};


exports.getVideoAlbums = async (albumIdsList) => {
  const idsArray = albumIdsList.slice(1, -1).split('+').map(Number);
  const pArray = []; // set up promises array for all of the albums being requested
  for (let i = 0; i < idsArray.length; i += 1) {
    pArray.push(db.collection('videoAlbums').findOne({ _id: idsArray[i] }));
  }
  const albums = await Promise.all(pArray);
  for (let i = 0; i < idsArray.length; i += 1) {
    if (!albums[i]) { // validity check
      throw new Error('403 Album IDs list: ' + albumIdsList + ' is invalid.');
    }
  }
  return albums;
};

exports.getVideoAlbumByPath = async (pathEncoded) => {
  const thisPath = pathEncoded.slice(1, -1).replace(/\+/g, '/');
  const album = await db.collection('videoAlbums').findOne({ path: thisPath });
  if (!album) throw new Error('404 Unknown Album: ' + thisPath);
  return album;
};

exports.getVideoByPath = async (pathEncoded) => {
  // Note - this function currently assumes that the path sent does NOT include
  // the VIDEO_DIR.PATH at the front.  TODO: check for this instead of assuming ...
  const thisPath = cfg.VIDEO_DIR.PATH + pathEncoded.slice(1, -1).replace(/\+/g, '/');
  const video = await db.collection('videos').findOne({ fullPath: thisPath });
  if (!video) throw new Error('404 Unknown Video: ' + thisPath);
  return video;
};
