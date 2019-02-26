// fs-classes.ts - Declaration of FileSystem classes for downloads
// For now the downloads are all in a single directory.  TODO: make this multi-directory capable

export class Directory { // This is a future class, currently unused
    _id: number;
    name: string;
    path: string;
    description: string;
    fileIds: Array<number>;
    dirIds: Array<number>;
};

export class DlFile {
    _id: number;              // id of this File
    filename: string;         // filename without path
    fullPath: string;         // full path with filename
    suffix: string;           // suffix of file (eg: .pdf, .zip, etc)
    type: string;             // file type
    size: number;             // file size in bytes
    sizeHR: string;           // size in Human Readable string format
    icon: string;             // icon from fiv-viv icons to display

    constructor(iFile?: Partial<DlFile>) {
        this._id = (iFile && iFile._id !== undefined) ? iFile._id : -1;
        this.filename = (iFile && iFile.filename !== undefined) ? iFile.filename : '';
        this.fullPath = (iFile && iFile.fullPath !== undefined) ? iFile.fullPath : '';
        this.suffix = (iFile && iFile.suffix !== undefined) ? iFile.suffix : '';
        this.type = (iFile && iFile.type !== undefined) ? iFile.type : '';
        this.size = (iFile && iFile.size !== undefined) ? iFile.size : 0;
        this.sizeHR = (iFile && iFile.sizeHR !== undefined) ? iFile.sizeHR : '';
        this.icon = (iFile && iFile.icon !== undefined) ? iFile.icon : '';
    }
};

export class FilenameChangedObj {
    _id: number;
    oldFilename: string;
    newFilename: string;
}

