/* -----------------        download-service.js               ------------------
------------------------------------------------------------------------------*/

// External Imports:
const multer = require('multer');
const spawnProc = require('child_process').spawn;

// Project Imports:
const cfg = require('../config').downloadService;
const fileSvc = require('./file-service');
const dbSvc = require('./db-service');
const errSvc = require('./err-service');

// require('./db-service').then(res => {db = res});

/* eslint-disable no-use-before-define */ // Want to put this iife at top of file
let db;
(async () => {
  // IIFE to run during init, building the file objects for the download directory and storing
  // them in the database for retrieval by the client via the api.
  try {
    db = await dbSvc.database;
    const files = await fileSvc.downloadFiles(cfg.DOWNLOAD_DIR.PATH, isDownloadSuffix);
    const downloads = await buildDownloads(files);
    await saveDataToDB(cfg.DB_COLLECTION_NAME, downloads);
    console.log(Date(Date.now()) + ' : created new "download" document in db.');
  } catch (err) {
    errSvc.exit(err, 1);
  }
})();
/* eslint-enable no-use-before-define */

function isDownloadSuffix(/* str */) { // TODO: restrict file types.  For now, wide open
  //    const suffix = str.substr(-4,4).toLowerCase();
  return true;
}

// Set up Multer
const multerConf = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, 'protected/downloads/');
    },
    filename: (req, file, next) => {
      next(null, file.originalname);
    },
  }),
};
const multerUpload = multer(multerConf).single('upload');
exports.upload = (req, res, next) => {
  req.on('aborted', () => {
    console.log('Upload aborted by client.');
  });
  req.on('close', () => {
    if (req.file) {
      console.log(Date(Date.now()) + ' : File Uploaded: "' + req.file.filename + '"');
    }
  });
  // Middleware function to upload - define next to handle errors
  multerUpload(req, res, (err) => {
    if (!err) { next(); }
    console.log(err);
    return res.status(422).send('Error uploading file.');
  });
};

async function saveDataToDB(collection, data) {
  try {
    if (await db.collection(collection).count() > 0) { // already exists
      await db.collection(collection).drop(); // wipe it out.
    }
    await db.collection(collection).insertMany(data);
  } catch (err) { errSvc.exit(err); }
}

function grepPromise(search) {
  // This "promisifies" the spawn function call to grep.
  return new Promise((resolve, reject) => {
    // Note - we want to escape any characters in search that are non-alphanumeric
    // Also want to search at the beginning of a line only, and ending with |
    /* eslint-disable-next-line no-useless-escape */ // Not useless in this case!
    const regexSearch = '^' + search.replace(/(?=\W)/g, '\\') + '\|';
    const grep = spawnProc('grep', ['-e', regexSearch, cfg.TYPE_DESCRIPTION_DB]);
    let dataOut = ''; // buffer results sent
    let dataErr = '';
    grep.stdout.on('data', (data) => { dataOut += data; });
    grep.stderr.on('data', (data) => { dataErr += data; });
    grep.on('close', (returnCode) => {
      if (dataErr && (returnCode !== 0)) {
        console.log('grepPromise Error! Return code is: ' + returnCode);
        reject(dataErr);
      } else {
        resolve(dataOut);
      }
    });
    grep.on('error', err => reject(err));
  });
}

async function getTypeDescription(type) {
  const grepResult = await grepPromise(type);
  let removeLF;
  if (grepResult) { // if no result, grepResult will be 'undefined'
    const description = grepResult.split('|')[1]; // get just the description
    removeLF = description.slice(0, -1); // strip the linefeed off the end
  }
  return removeLF;
}

function humanFileSize(bytes, si) {
  // taken from mpen's answer in https://stackoverflow.com/questions/10420352/ but linted
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  let b = bytes;
  do {
    b /= thresh;
    u += 1;
  } while (Math.abs(b) >= thresh && u < units.length - 1);
  return b.toFixed(1) + ' ' + units[u];
}

async function buildDownloads(files) {
  // Returns an array of fileObjects which represents all the files in the downloads directory
  const downloads = [];
  // let index = 0;
  for (let i = 0; i < files.length; i += 1) {
    const filename = files[i].filename;
    const fileObject = {};
    fileObject._id = i;
    fileObject.filename = filename;
    fileObject.fullPath = cfg.DOWNLOAD_DIR.PATH + filename;
    fileObject.suffix = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    /* eslint-disable-next-line no-await-in-loop */
    fileObject.type = await getTypeDescription(fileObject.suffix.slice(1));
    fileObject.size = files[i].size;
    fileObject.sizeHR = humanFileSize(files[i].size, cfg.USE_SI_SIZE);
    fileObject.icon = 'fiv-viv fiv-icon-' + fileObject.suffix.slice(1);
    downloads.push(fileObject);
  }
  return downloads;
}

exports.updateDownloadsDB = async (file) => {
  try { // Find the last download, then create a new one at the end of the collection
    const lastDl = await db.collection(cfg.DB_COLLECTION_NAME)
      /* eslint-disable-next-line newline-per-chained-call */ // Lint not applicable in this case
      .find().sort({ _id: -1 }).limit(1).next();
    const fileObject = {};
    fileObject._id = lastDl._id + 1;
    fileObject.filename = file.filename;
    fileObject.fullPath = '/' + file.path;
    fileObject.suffix = file.filename.slice(file.filename.lastIndexOf('.')).toLowerCase();
    fileObject.type = await getTypeDescription(fileObject.suffix.slice(1));
    fileObject.size = file.size;
    fileObject.sizeHR = humanFileSize(file.size, cfg.USE_SI_SIZE);
    fileObject.icon = 'fiv-viv fiv-icon-' + fileObject.suffix.slice(1);
    const dlReturned = await db.collection(cfg.DB_COLLECTION_NAME)
      .findOne({ filename: file.filename });
    if (dlReturned) { // a download with the same name exists - update it
      fileObject._id = dlReturned._id;
      await db.collection(cfg.DB_COLLECTION_NAME).replaceOne({ _id: dlReturned._id }, fileObject);
    } else {
      await db.collection(cfg.DB_COLLECTION_NAME).insertOne(fileObject);
    }
    return fileObject;
  } catch (err) { errSvc.exit(err); }
  return null;
};

exports.getDownload = async (dlName) => {
  const download = await db.collection(cfg.DB_COLLECTION_NAME).findOne({ filename: dlName });
  if (!download) throw new Error('404 Unknown File.');
  return download;
};

exports.getList = async () => {
  try {
    const downloads = await db.collection(cfg.DB_COLLECTION_NAME).find({}).toArray();
    return downloads;
  } catch (err) { errSvc.exit(err, 1); }
  return null;
};

exports.delete = async (dlName) => {
  await exports.getDownload(dlName); // verify it exists before doing any work
  await fileSvc.deleteFile('.' + cfg.DOWNLOAD_DIR.PATH + dlName);
  const result = await db.collection(cfg.DB_COLLECTION_NAME).findOneAndDelete(
    { filename: dlName },
  );
  if (result.lastErrorObject.n !== 1) {
    throw new Error('404 File not found in database.');
  }
  return result.value;
};
