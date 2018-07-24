import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, pipe, of } from 'rxjs';
import { filter, tap, map, mergeMap, flatMap, concatMap, concatAll, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Album, Photo } from '../_classes/photo-classes';
import { UrlSegment } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public curAlbum: Album;

  constructor(private http: HttpClient) {
  // set up default starting values
  };

  public getAlbumById(id: number): Observable<Album> {
    return <Observable<Album>>this.http.get('/api/photos/album-by-id/' + id);
  };

  public getAlbumByPath(path: string): Observable<Album> {
    let pathString = '(' + path.split('/').join('+') + ')';
    if (pathString == '(albums)') pathString = '()'; // 'albums' is our root path.
    return <Observable<Album>>this.http.get('/api/photos/album-by-path/' + pathString);
  };

  public getAlbums(albums: Array<number>): Observable<Album[]> {
    let albumString = '(' + albums.join('+') + ')';
    return <Observable<Album[]>>this.http.get('/api/photos/albums/' + albumString);
  };

  public getAlbumByURL(url: Observable<UrlSegment[]>): Observable<Album> {
  // This function takes in an UrlSegment array, joins those segments into a path,
  // passes that path to getAlbumsByPath and returns an observable which resolves to
  // the resulting album.
    return url.pipe(flatMap(segments => this.getAlbumByPath(segments.join('/'))))
  };

  public getAlbumsByURL(url: Observable<UrlSegment[]>): Observable<Album[]> {
  // This function takes in an UrlSegment array, joins those segments into a path, 
  // and passes that path to getAlbumsByPath.  Once that observable resolves into 
  // an album, it then calls getAlbums with that album's album.albums array and 
  // returns an observable that resolves to the resulting array of album objects.
  return url.pipe(flatMap(segments => this.getAlbumByPath(segments.join('/'))
      .pipe(flatMap(album => this.getAlbums(album.albums)))))
  };

}
