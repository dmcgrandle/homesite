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
    };
