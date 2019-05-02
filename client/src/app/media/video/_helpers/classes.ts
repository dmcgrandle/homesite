// video classes - Declaration of Video and VideoAlbum classes

import { MediaAlbum, Media } from 'media/_helpers/classes';

export class VideoAlbum extends MediaAlbum {
    // mediaIds: Array<number>;  // array of Photo ids (if any) this Album contains
}

export class Video extends Media {
    // thumbPath: string;        // full path and filename of thumbnail
}