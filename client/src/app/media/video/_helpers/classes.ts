// video classes - Declaration of Video and VideoAlbum classes

import { MediaAlbum, Media } from 'media/_helpers/classes';

export class VideoAlbum extends MediaAlbum {
    // mediaIds: Array<number>;  // array of Photo ids (if any) this Album contains
}

export class Video extends Media {
    // thumbPath: string;        // full path and filename of thumbnail
}

/*
// video-classes.ts - Declaration of Video and video Album classes

export class VideoAlbum {
    _id: number;              // id of this VideoAlbum - top level id == 0
    name: string;             // Name of the album (directory name)
    path: string;             // physical directory path of this album
    description: string;      // Description of this album
    featuredMedia: Video;     // Video to be displayed as the album cover
    mediaIds: Array<number>;  // array of Video ids (if any) this album contains
    albumIds: Array<number>;  // array of VideoAlbum ids (if any) this album contains
}

export class Video {
    _id: number;              // id of this Video
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of video
    posterPath: string;       // full path and filename of poster (video thumbnail)
    caption?: string;         // optional caption for video
}
*/
