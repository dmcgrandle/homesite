// photo-classes.ts - Declaration of Photo and PhotoAlbum classes

export class PhotoAlbum {
    _id: number;              // id of this PhotoAlbum - top level id == 0
    name: string;             // Name of the PhotoAlbum (directory name)
    path: string;             // physical directory path of this PhotoAlbum
    description: string;      // Description of this PhotoAlbum
    featuredMedia: Photo;     // Photo to be displayed as the PhotoPhotoAlbum cover
    photoIds: Array<number>;  // array of Photo ids (if any) this PhotoAlbum contains
    albumIds: Array<number>;  // array of photoAlbum ids (if any) this PhotoAlbum contains
    };

    export class Photo {
    _id: number;              // id of this Photo
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of photo
    thumbPath: string;        // full path and filename of thumbnail
    caption?: string;          // optional caption for photo
    };
