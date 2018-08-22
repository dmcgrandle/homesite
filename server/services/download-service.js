/* -----------------        download-service.js               ------------------

------------------------------------------------------------------------------*/

// External Imports:
const spawn = require('child_process').spawn;

// Project Imports:
const cfg = require('../config').downloadService;
const fileSvc = require('./file-service');
const errSvc = require('./err-service');

// require('./db-service').then(res => {db = res});

let db;
(async function() {
// IIFE to run during init, building the file objects for the download directory and storing 
// them in the database for retrieval by the client via the api.
    try {
        db = await require('./db-service');
        const files = await fileSvc.downloadFiles(cfg.DOWNLOAD_DIR.PATH, isDownloadSuffix);
        const downloads = await buildDownloads(files);
        await saveDataToDB('downloads', downloads);
        console.log(Date(Date.now()) + ' : created new "download" document in db.');
    }
    catch(err) {errSvc.exit(err, 1)};
})();

exports.deleteme = async function() {
};

exports.getList = async function() {
    try {
        const downloads = await db.collection('downloads').find({}).toArray();
        return downloads;
    } catch(err) {errSvc.exit(err, 1)};
  };

saveDataToDB = async function (collection, data) {
    try { 
        if (0 != await db.collection(collection).find({_id : 0}).limit(1).count()) {// already exists
            await db.collection(collection).drop(); // wipe it out.
        }
        await db.collection(collection).insertMany(data);
    } catch (err) { errSvc.exit(err) };
}

buildDownloads = async function (files) {
    // Returns an array of fileObjects which represents all the files in the downloads directory
    let downloads = [];
    index = 0;
    for (let i=0;i<files.length;i++) {
        const file = files[i].filename;
        const size = files[i].size;
        let fileObject = {};
        fileObject._id = i;
        fileObject.filename = file;
        fileObject.fullPath = cfg.DOWNLOAD_DIR.PATH + file;
        fileObject.suffix = file.slice(file.lastIndexOf('.'));
        fileObject.type = await getTypeDescription(fileObject.suffix.slice(1));
        fileObject.size = humanFileSize(size, cfg.USE_SI_SIZE);
        fileObject.icon = 'fiv-viv fiv-icon-' + fileObject.suffix.slice(1);
        downloads.push(fileObject);
    }
    return downloads;
}

getTypeDescription = async function (type) {
    const grepResult = await grepPromise(type); 
    let removeLF;
    if (grepResult) { // if no result, grepResult will be 'undefined'
        const description = grepResult.split('|')[1]; // get just the description
        removeLF = description.slice(0, -1); // strip the linefeed off the end
    }
    return removeLF;
}

grepPromise = function(search) {
    // This "promisifies" the spawn function call to grep.
    return new Promise (function (resolve, reject) {
        // Note - we want to escape any characters in search that are non-alphanumeric
        // Also want to search at the beginning of a line only, and ending with |
        const regexSearch = '^' + search.replace(/(?=\W)/g, '\\') + '\|';
        const grep = spawn('grep', ['-e', regexSearch, cfg.TYPE_DESCRIPTION_DB ]);
        let dataOut = ""; // buffer results sent
        let dataErr = "";
        grep.stdout.on('data', data => dataOut += data);
        grep.stderr.on('data', data => dataErr += data);
        grep.on('close', returnCode => {
            if (dataErr && (returnCode != 0)) {
                console.log('grepPromise Error! Return code is: ' + returnCode);
                reject(dataErr);
            }
            else {
                resolve(dataOut);
            }
        });
        grep.on('error', err => reject(err));
    });
}

isDownloadSuffix = function(str) { //TODO: restrict file types.  For now, wide open
//    const suffix = str.substr(-4,4).toLowerCase();
    return true;
};

function humanFileSize(bytes, si) {
    // taken from mpen's answer in https://stackoverflow.com/questions/10420352/
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

