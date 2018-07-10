// No photos may be present in an album which contains other albums, if

export class Album {
  _id: number;              // id of this PhotoAlbum - top level id == 0
  path: string;             // physical directory path of this album
  description: string;      // Description of this album
  featuredPhoto: Photo;     // Photo to be displayed as the album cover
  containsAlbums: boolean;  // if true, this is an album of albums, not photos
  contains: Array<Photo> | Array<number>; // Array of photo(s) or album ids
};

export class Photo {
  filename: string;
  caption: string;
}
