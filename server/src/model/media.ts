// Declaration of various Media interfaces

export interface MediaAlbum {
    _id: number;              // id of this Album - top level id == 0
    name: string;             // Name of the Album (directory name)
    path: string;             // physical directory path of this Album
    description: string;      // Description of this Album
    featuredMedia: Media;     // Media to be displayed as the album cover
    mediaIds: Array<number>;  // array of Media ids (if any) this Album contains
    albumIds: Array<number>;  // array of Album ids (if any) this Album contains (nested albums)
}

export interface Media {
    _id: number;              // id of this media
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of media
    thumbPath: string;        // full path and filename of thumbnail
    caption?: string;         // optional caption for media
}

export interface PhotoAlbum extends MediaAlbum {
}

export interface Photo extends Media {
}

export interface VideoAlbum extends MediaAlbum {
}

export interface Video extends Media {
}