import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UrlSegment } from '@angular/router';

import { Album, Photo } from '../_helpers/classes';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    public curAlbum: Album; // used to keep track of current Album between components
    public curPhoto: Photo;

    constructor(private http: HttpClient) { };

    public getPhotoById(id: number): Observable<Photo> {
        return <Observable<Photo>>this.http.get('/api/photos/photo-by-id/' + id);
    };

    public getPhotosByIdArray(photos: Array<number>): Observable<Photo[]> {
        return <Observable<Photo[]>>this.http.get('/api/photos/photos/(' + photos.join('+') + ')');
    };

    public getThumbsByIdArray(thumbIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>this.http.get('/api/photos/thumbs/(' + thumbIds.join('+') + ')');
    };

    public getAlbumById(id: number): Observable<Album> {
        return <Observable<Album>>this.http.get('/api/photos/album-by-id/' + id);
    };

    public getAlbumByPath(path: string): Observable<Album> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString == '(albums)') pathString = '()'; // 'albums' is our root path.
        return <Observable<Album>>this.http.get('/api/photos/album-by-path/' + pathString);
    };

    public getAlbumsByIdArray(albumIds: Array<number>): Observable<Album[]> {
        let albumString = '(' + albumIds.join('+') + ')';
        return <Observable<Album[]>>this.http.get('/api/photos/albums/' + albumString);
    };

    public getAlbumByURL(url: Observable<UrlSegment[]>): Observable<Album> {
        // This function takes in an Observable of an UrlSegment array, joins those segments 
        // into a path, passes that path to getAlbumsByPath.  When that resolves it saves the 
        // resulting album into curAlbum variable (class scope).  Ultimately this function 
        // returns an observable which resolves to the album from getAlbumByPath.
        return url.pipe(
            switchMap(segments => this.getAlbumByPath(segments.join('/'))),
            tap(album => this.curAlbum = album)
        );
    };

    public getAlbumsByURL(url: Observable<UrlSegment[]>): Observable<Album[]> {
        // This function effectively collapses three observables into one: It first takes 
        // in an observable of an UrlSegment array. When that resolves, it joins those 
        // segments into a path, and passes that path to getAlbumsByPath (the second 
        // observable). Once that observable resolves into an album, it then saves the result
        // into the curAlbum variable (class scope) and finally calls getAlbums 
        // (the third observable) with that album's album.Albums array.  This entire method
        // ultimately returns an observable that resolves to the resulting array of album 
        // objects from getAlbumsByIdArray.  
        // Whew - that's a lot for just a few lines of code!  :)
        return url.pipe(
            switchMap(segments => this.getAlbumByPath(segments.join('/'))),
            tap(album => this.curAlbum = album),
            switchMap(album => this.getAlbumsByIdArray(album.albumIds))
        );
    };

}
