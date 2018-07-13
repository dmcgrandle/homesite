// photo-classes.ts - Declaration of Photo and Album classes

export class Album {
  _id: number;              // id of this PhotoAlbum - top level id == 0
  name: string;             // Name of the album (directory name)
  path: string;             // physical directory path of this album
  description: string;      // Description of this album
  featuredPhoto: Photo;     // Photo to be displayed as the album cover
  photos: Array<Photo>;     // Photos (if any) this album contains
  albums: Array<number>;    // array of Album id's (if any) this album contains

constructor() { 
/*  this._id = 0;
  this.name = '';
  this.path = '';
  this.description = '';
  this.featuredPhoto = {
    filename : '',
    caption: ''
  }
  this.photos = [];
  this.albums = []; */
}

};

export class Photo {
  filename: string;
  caption: string;
}
