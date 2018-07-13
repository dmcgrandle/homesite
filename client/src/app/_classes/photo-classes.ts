// photo-classes.ts - Declaration of Photo and Album classes
// 
// Note on the "albums" element of class Album: it can be either
// an array of numbers or an array of Album(s).  This is because
// of depth - if an 

export class Album {
  _id: number;              // id of this PhotoAlbum - top level id == 0
  name: string;             // Name of the album (directory name)
  path: string;             // physical directory path of this album
  description: string;      // Description of this album
  featuredPhoto: Photo;     // Photo to be displayed as the album cover
  photos: Array<Photo>;     // Photos (if any) this album contains
  albums: Array<number> | Array<Album>;
};

export class Photo {
  filename: string;
  caption: string;
}
