// photo-classes.ts - Declaration of Photo and Album classes

export class Album {
    _id: number;              // id of this Album - top level id == 0
    name: string;             // Name of the Album (directory name)
    path: string;             // physical directory path of this Album
    description: string;      // Description of this Album
    featuredMedia: Photo;     // Photo to be displayed as the Album cover
    photoIds: Array<number>;  // array of Photo ids (if any) this Album contains
    albumIds: Array<number>;  // array of Album ids (if any) this Album contains (nested albums)
    };

    export class Photo {
    _id: number;              // id of this Photo
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of photo
    thumbPath: string;        // full path and filename of thumbnail
    caption?: string;          // optional caption for photo
    };
