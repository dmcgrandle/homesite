export interface DownloadInterface {
    _id: number;
    filename: string;
    fullPath: string;
    suffix: string;
    type: string;
    size: number;
    sizeHR: string;
    icon: string;
}

export interface FileObject {
    filename: string;
    size: number;
    path?: string;
}

export interface FilenameChangedObj {
    _id: number;
    oldFilename: string;
    newFilename: string;
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