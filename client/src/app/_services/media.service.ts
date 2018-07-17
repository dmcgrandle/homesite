import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, pipe, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Album, Photo } from '../_classes/photo-classes';
import { UrlSegment } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public curAlbum: Album;
  public prevPath: string = '';

  constructor(private http: HttpClient) {
  // set up default starting values
  }

  public getAlbumById(id: number): Observable<any> {
    return this.http.get('/api/photos/album-by-id/' + id);
  }

  public getAlbumByPath(path: string): Observable<any> {
    let pathString = '(' + path.split('/').join('+') + ')';
    console.log('pathString is: ' + pathString);
    return this.http.get('/api/photos/album-by-path/' + pathString);
  }

  public getAlbums(albums: Array<number>): Observable<any> {
    let albumString = '(' + albums.join('+') + ')';
    return this.http.get('/api/photos/albums/' + albumString);
  }


}
