// Declaration of various Media interfaces

export interface MediaAlbum {
    _id: number;              // id of this Album - top level id == 0
    name: string;             // Name of the Album (directory name)
    path: string;             // physical directory path of this Album
    description: string;      // Description of this Album
    featuredMedia: Media;     // Media to be displayed as the album cover
    mediaIds: number[];  // array of Media ids (if any) this Album contains
    albumIds: number[];  // array of Album ids (if any) this Album contains (nested albums)
}

export interface Media {
    _id: number;              // id of this media
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of media
    thumbPath: string;        // full path and filename of thumbnail
    caption?: string;         // optional caption for media
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PhotoAlbum extends MediaAlbum {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Photo extends Media {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VideoAlbum extends MediaAlbum {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Video extends Media {
}

// TODO: can probably delete this intermediate type when refactored to use Observables
export interface MediaData {
    albums: MediaAlbum[];
    media: Media[];
}