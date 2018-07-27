// photo-classes.ts - Declaration of Photo and Album classes

export class Album {
  _id: number;              // id of this PhotoAlbum - top level id == 0
  name: string;             // Name of the album (directory name)
  path: string;             // physical directory path of this album
  description: string;      // Description of this album
  featuredPhoto: Photo;     // Photo to be displayed as the album cover
  photos: Array<number>;    // array of Photo ids (if any) this album contains
  albums: Array<number>;    // array of Album ids (if any) this album contains
};

export class Photo {
  _id: number;              // id of this Photo
  filename: string;         // filename without path
  fullPath: string;         // full path and filename of photo
  thumbPath: string;        // full path and filename of thumbnail
  caption: string;          // optional caption for photo
};
