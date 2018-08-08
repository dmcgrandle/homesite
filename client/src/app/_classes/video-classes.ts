// video-classes.ts - Declaration of Video and video Album classes

export class VideoAlbum {
    _id: number;              // id of this VideoAlbum - top level id == 0
    name: string;             // Name of the album (directory name)
    path: string;             // physical directory path of this album
    description: string;      // Description of this album
    featuredMedia: Video;     // Video to be displayed as the album cover
    videos: Array<number>;    // array of Video ids (if any) this album contains
    albums: Array<number>;    // array of VideoAlbum ids (if any) this album contains
    };

    export class Video {
    _id: number;              // id of this Video
    filename: string;         // filename without path
    fullPath: string;         // full path and filename of video
    posterPath: string;        // full path and filename of poster (video thumbnail)
    caption: string;          // optional caption for video
    };
  