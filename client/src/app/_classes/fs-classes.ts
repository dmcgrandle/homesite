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

export class File {
    _id: number;              // id of this File
    filename: string;         // filename without path
    fullPath: string;         // full path with filename
    suffix: string;           // suffix of file (eg: .pdf, .zip, etc)
    type: string;             // file type
    size: string;
    icon: string;
    };
