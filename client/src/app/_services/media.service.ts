import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Album, Photo } from '../_classes/photo-classes';
import { UrlSegment } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public curPhotoAlbum: Album; // used to keep track of current album between components

  constructor(private http: HttpClient) {};

  public getPhotoById(id: number): Observable<Photo> {
    return <Observable<Photo>>this.http.get('/api/photos/photo-by-id/' + id);
  };

  public getPhotosByIdArray(photos: Array<number>): Observable<Photo[]> {
    return <Observable<Photo[]>>this.http.get('/api/photos/photos/(' + photos.join('+') + ')');
  };

  public getThumbsByIdArray(thumbs: Array<number>): Observable<string[]> {
    return <Observable<string[]>>this.http.get('/api/photos/thumbs/(' + thumbs.join('+') + ')');
  };

  public getPhotoAlbumById(id: number): Observable<Album> {
    return <Observable<Album>>this.http.get('/api/photos/album-by-id/' + id);
  };

  public getPhotoAlbumByPath(path: string): Observable<Album> {
    let pathString = '(' + path.split('/').join('+') + ')';
    if (pathString == '(albums)') pathString = '()'; // 'albums' is our root path.
    return <Observable<Album>>this.http.get('/api/photos/album-by-path/' + pathString);
  };

  public getPhotoAlbumsByIdArray(albums: Array<number>): Observable<Album[]> {
    let albumString = '(' + albums.join('+') + ')';
    return <Observable<Album[]>>this.http.get('/api/photos/albums/' + albumString);
  };

  public getPhotoAlbumByURL(url: Observable<UrlSegment[]>): Observable<Album> {
  // This function takes in an UrlSegment array, joins those segments into a path,
  // passes that path to getAlbumsByPath.  When that resolves it saves the resulting
  // album into curPhotoAlbum variable (class scope).  Ultimately this function 
  // returns an observable which resolves to the album from getPhotoAlbumByPath.
    return url.pipe(
      flatMap(segments => this.getPhotoAlbumByPath(segments.join('/'))),
      tap(album => this.curPhotoAlbum = album)
    );
  };

  public getPhotoAlbumsByURL(url: Observable<UrlSegment[]>): Observable<Album[]> {
  // This function effectively collapses three observables into one: It first takes 
  // in an observable of an UrlSegment array. When that resolves, it joins those 
  // segments into a path, and passes that path to getPhotoAlbumsByPath (the second 
  // observable). Once that observable resolves into an album, it then saves the result
  // into the curPhotoAlbum variable (class scope) and finally calls getPhotoAlbums 
  // (the third observable) with that album's album.albums array.  This entire method
  // ultimately returns an observable that resolves to the resulting array of album 
  // objects from getPhotoAlbumsByIdArray.  
  // Whew - that's a lot for just a few lines of code!  :)
    return url.pipe(
      switchMap(segments => this.getPhotoAlbumByPath(segments.join('/'))),
      tap(album => this.curPhotoAlbum = album),
      switchMap(album => this.getPhotoAlbumsByIdArray(album.albums))
    );
  };

}
