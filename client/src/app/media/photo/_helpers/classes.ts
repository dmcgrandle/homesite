// photo classes - Declaration of Photo and PhotoAlbum classes

import { MediaAlbum, Media } from 'media/_helpers/classes';

export class PhotoAlbum extends MediaAlbum {
    // mediaIds: Array<number>;  // array of Photo ids (if any) this Album contains
}

export class Photo extends Media {
    // thumbPath: string;        // full path and filename of thumbnail
}
