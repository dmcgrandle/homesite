// Declaration of various Media interfaces

interface MediaInterface {
    _id: number; // id of this media
    filename: string; // filename without path
    path: string; // path without filename relative to cfg.XXXXX_DIR_PATH
    fullPath: string; // full path and filename of media
    thumbPath: string; // full path and filename of thumbnail
    caption?: string; // optional caption for media
}

export class Media implements MediaInterface {
    public _id: number;
    public filename: string;
    public path: string;
    public fullPath: string;
    public thumbPath: string;
    public caption?: string;

    public constructor(m?: Partial<Media>) {
        this._id = m && m._id !== undefined ? m._id : -1;
        this.filename = m && m.filename !== undefined ? m.filename : '';
        this.path = m && m.path !== undefined ? m.path : '';
        this.fullPath = m && m.fullPath !== undefined ? m.fullPath : '';
        this.thumbPath = m && m.thumbPath !== undefined ? m.thumbPath : '';
        this.caption = m && m.caption !== undefined ? m.thumbPath : undefined;
    }
}

interface MediaAlbumInterface {
    _id: number; // id of this Album - top level id == 0
    name: string; // Name of the Album (directory name)
    path: string; // path WITH (directory) name relative to cfg.XXXXX_DIR_PATH
    fullPath: string; // full path including this album's name
    description: string; // Description of this Album
    featuredMedia: Media; // Media to be displayed as the album cover
    mediaIds: number[]; // array of Media ids (if any) this Album contains
    albumIds: number[]; // array of Album ids (if any) this Album contains (nested albums)
}

export class MediaAlbum implements MediaAlbumInterface {
    public _id: number;
    public name: string;
    public path: string;
    public fullPath: string;
    public description: string;
    public featuredMedia: Media;
    public mediaIds: number[];
    public albumIds: number[];

    public constructor(m?: Partial<MediaAlbum>) {
        this._id = m && m._id !== undefined ? m._id : -1;
        this.name = m && m.name !== undefined ? m.name : '';
        this.path = m && m.path !== undefined ? m.path : '';
        this.fullPath = m && m.fullPath !== undefined ? m.fullPath : '';
        this.description = m && m.description !== undefined ? m.description : '';
        this.featuredMedia =
            m && m.featuredMedia !== undefined ? m.featuredMedia : new Media();
        this.mediaIds = m && m.mediaIds !== undefined ? m.mediaIds : [];
        this.albumIds = m && m.albumIds !== undefined ? m.albumIds : [];
    }
}

export class PhotoAlbum extends MediaAlbum {
    public constructor(m?: Partial<PhotoAlbum>) {
        super(m);
    }
}

export class Photo extends Media {
    public constructor(m?: Partial<Photo>) {
        super(m);
    }
}

export class VideoAlbum extends MediaAlbum {
    public constructor(m?: Partial<VideoAlbum>) {
        super(m);
    }
}

export class Video extends Media {
    public constructor(m?: Partial<Video>) {
        super(m);
    }
}

// TODO: can probably delete this intermediate type when refactored to use Observables
export interface MediaData {
    albums: MediaAlbum[];
    media: Media[];
}
