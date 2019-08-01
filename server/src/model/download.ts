interface FileObjectInterface {
    isFile?: boolean;
    filename: string;
    size: number;
    path?: string;
}

export class FileObject implements FileObjectInterface {
    isFile?: boolean;
    filename: string;
    size: number;
    path?: string;

    constructor(fo?: Partial<FileObject>) {
        this.isFile = fo && fo.isFile !== undefined ? fo.isFile : undefined;
        this.filename = fo && fo.filename !== undefined ? fo.filename : '';
        this.size = fo && fo.size !== undefined ? fo.size : 0;
        this.path = fo && fo.path !== undefined ? fo.path : undefined;
    }
}

interface FilenameChangedObjInterface {
    _id: number;
    oldFilename: string;
    newFilename: string;
}

export class FilenameChangedObj implements FilenameChangedObjInterface {
    _id: number;
    oldFilename: string;
    newFilename: string;

    constructor(fco?: Partial<FilenameChangedObj>) {
        this._id = fco && fco._id !== undefined ? fco._id : 0;
        this.oldFilename = fco && fco.oldFilename !== undefined ? fco.oldFilename : '';
        this.newFilename = fco && fco.newFilename !== undefined ? fco.newFilename : '';
    }
}

interface DownloadInterface {
    _id: number;
    filename: string;
    fullPath: string;
    suffix: string;
    type: string;
    size: number;
    sizeHR: string;
    icon: string;
}

export class Download implements DownloadInterface {
    _id: number; // id of this File
    filename: string; // filename without path
    fullPath: string; // full path with filename
    suffix: string; // suffix of file (eg: .pdf, .zip, etc)
    type: string; // file type
    size: number; // file size in bytes
    sizeHR: string; // size in Human Readable string format
    icon: string; // icon from fiv-viv icons to display

    constructor(iDL?: Partial<Download>) {
        this._id = iDL && iDL._id !== undefined ? iDL._id : -1;
        this.filename = iDL && iDL.filename !== undefined ? iDL.filename : '';
        this.fullPath = iDL && iDL.fullPath !== undefined ? iDL.fullPath : '';
        this.suffix = iDL && iDL.suffix !== undefined ? iDL.suffix : '';
        this.type = iDL && iDL.type !== undefined ? iDL.type : '';
        this.size = iDL && iDL.size !== undefined ? iDL.size : 0;
        this.sizeHR = iDL && iDL.sizeHR !== undefined ? iDL.sizeHR : '';
        this.icon = iDL && iDL.icon !== undefined ? iDL.icon : '';
    }
}