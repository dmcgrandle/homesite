// To allow nesting of photo albums, two classes are created, with the only
// difference being the PhotoAlbum has an array of Photos and the AlbumList
// has the 'contains' member, which is an array that contains either other
// AlbumList(s) or PhotoAlbum(s)

export class PhotoAlbum {
  name : string;          // Name of this album
  description : string;   // Description of this album
  dir: string;            // directory name for this album
  featuredPhoto : {
    filename: string;
    caption: string;
  };
  photos: Array<Photo>;
};

export class PhotoAlbumList {
  name: string;
  description: string;
  dir: string;
  featuredPhoto: {
    filename: string;
    caption: string;
  }
  contains: Array<PhotoAlbum | PhotoAlbumList>;  // Array of {PhotoAlbums or AlbumLists} this list contains
}

export class Photo {
  filename: string;
  caption: string;
}
