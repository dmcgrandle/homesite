import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Album, Photo } from '../_classes/photo-classes';
import { UrlSegment } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public curPhotoAlbum: Album; // used to keep track of current album between components

  constructor(private http: HttpClient) {};

  public getPhotoAlbumById(id: number): Observable<Album> {
    return <Observable<Album>>this.http.get('/api/photos/album-by-id/' + id);
  };

  public getPhotoAlbumByPath(path: string): Observable<Album> {
    let pathString = '(' + path.split('/').join('+') + ')';
    if (pathString == '(albums)') pathString = '()'; // 'albums' is our root path.
    return <Observable<Album>>this.http.get('/api/photos/album-by-path/' + pathString);
  };

  public getPhotoAlbums(albums: Array<number>): Observable<Album[]> {
    let albumString = '(' + albums.join('+') + ')';
    return <Observable<Album[]>>this.http.get('/api/photos/albums/' + albumString);
  };

  public getPhotoAlbumByURL(url: Observable<UrlSegment[]>): Observable<Album> {
  // This function takes in an UrlSegment array, joins those segments into a path,
  // passes that path to getAlbumsByPath and returns an observable which resolves to
  // the resulting album.
    return url.pipe(flatMap(segments => this.getPhotoAlbumByPath(segments.join('/'))))
  };

  public getPhotoAlbumsByURL(url: Observable<UrlSegment[]>): Observable<Album[]> {
  // This function effectively collapses three observables into one: It first takes 
  // in an observable of an UrlSegment array. When that resolves, it joins those 
  // segments into a path, and passes that path to getPhotoAlbumsByPath (the second 
  // observable). Once that observable resolves into an album, it then saves the 
  // result into the curPhotoAlbum variable (class scope) and finally calls getAlbums 
  // (the third observable) with that album's album.albums array.  getPhotoAlbumsByURL
  // ultimately returns an observable that resolves to the resulting array of album 
  // objects from getPhotoAlbums.  Whew - that's a lot for just a few lines of code!  :)
  return url.pipe(flatMap(segments => this.getPhotoAlbumByPath(segments.join('/'))
      .pipe(flatMap(album => {
        this.curPhotoAlbum = album; // save current album before next step
        return this.getPhotoAlbums(album.albums);
      }
    ))));
  };

}
