// No photos may be present in an album which contains other albums, if

export class Album {
  _id: number;              // id of this PhotoAlbum - top level id == 0
  name: string;             // Name of the album (directory name)
  path: string;             // physical directory path of this album
  description: string;      // Description of this album
  featuredPhoto: Photo;     // Photo to be displayed as the album cover
  photos: Array<Photo>;     // Photos (if any) this album contains
  albums: Array<number>;    // album ids (if any) this album contains
};

export class Photo {
  filename: string;
  caption: string;
}
