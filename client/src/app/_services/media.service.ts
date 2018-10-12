import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { PhotoAlbum, Photo } from '../_classes/photo-classes';
import { VideoAlbum, Video } from '../_classes/video-classes';
import { UrlSegment } from '../../../node_modules/@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    public curPhotoAlbum: PhotoAlbum; // used to keep track of current PhotoAlbum between components
    public curPhoto: Photo;
    public curVideoAlbum: VideoAlbum;
    public curVideo: Video;

    constructor(private http: HttpClient) { };

    public getPhotoById(id: number): Observable<Photo> {
        return <Observable<Photo>>this.http.get('/api/photos/photo-by-id/' + id);
    };

    public getVideoById(id: number): Observable<Video> {
        return <Observable<Video>>this.http.get('/api/videos/video-by-id/' + id);
    };

    public getVideoByPath(path: string): Observable<Video> {
        let fullPath = '(' + path.split('/').join('+') + ')';
        return <Observable<Video>>this.http.get('/api/videos/video-by-path/' + fullPath);
    };

    public getPhotosByIdArray(photos: Array<number>): Observable<Photo[]> {
        return <Observable<Photo[]>>this.http.get('/api/photos/photos/(' + photos.join('+') + ')');
    };

    public getVideosByIdArray(photos: Array<number>): Observable<Video[]> {
        return <Observable<Video[]>>this.http.get('/api/videos/videos/(' + photos.join('+') + ')');
    };

    public getThumbsByIdArray(thumbIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>this.http.get('/api/photos/thumbs/(' + thumbIds.join('+') + ')');
    };

    public getPostersByIdArray(posterIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>this.http.get('/api/videos/posters/(' + posterIds.join('+') + ')');
    };

    public getPhotoAlbumById(id: number): Observable<PhotoAlbum> {
        return <Observable<PhotoAlbum>>this.http.get('/api/photos/album-by-id/' + id);
    };

    public getPhotoAlbumByPath(path: string): Observable<PhotoAlbum> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString == '(photoAlbums)') pathString = '()'; // 'photoAlbums' is our root path.
        return <Observable<PhotoAlbum>>this.http.get('/api/photos/album-by-path/' + pathString);
    };

    public getVideoAlbumByPath(path: string): Observable<VideoAlbum> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString == '(videoAlbums)') pathString = '()';
        return <Observable<VideoAlbum>>this.http.get('/api/videos/album-by-path/' + pathString);
    };

    public getPhotoAlbumsByIdArray(albumIds: Array<number>): Observable<PhotoAlbum[]> {
        let albumString = '(' + albumIds.join('+') + ')';
        return <Observable<PhotoAlbum[]>>this.http.get('/api/photos/albums/' + albumString);
    };

    public getVideoAlbumsByIdArray(albumIds: Array<number>): Observable<VideoAlbum[]> {
        let albumString = '(' + albumIds.join('+') + ')';
        return <Observable<VideoAlbum[]>>this.http.get('/api/videos/albums/' + albumString);
    };

    public getPhotoAlbumByURL(url: Observable<UrlSegment[]>): Observable<PhotoAlbum> {
        // This function takes in an UrlSegment array, joins those segments into a path,
        // passes that path to getPhotoAlbumsByPath.  When that resolves it saves the resulting
        // album into curPhotoAlbum variable (class scope).  Ultimately this function 
        // returns an observable which resolves to the album from getPhotoAlbumByPath.
        return url.pipe(
            switchMap(segments => this.getPhotoAlbumByPath(segments.join('/'))),
            tap(album => this.curPhotoAlbum = album)
        );
    };

    public getPhotoAlbumsByURL(url: Observable<UrlSegment[]>): Observable<PhotoAlbum[]> {
        // This function effectively collapses three observables into one: It first takes 
        // in an observable of an UrlSegment array. When that resolves, it joins those 
        // segments into a path, and passes that path to getPhotoAlbumsByPath (the second 
        // observable). Once that observable resolves into an album, it then saves the result
        // into the curPhotoAlbum variable (class scope) and finally calls getPhotoAlbums 
        // (the third observable) with that album's album.photoAlbums array.  This entire method
        // ultimately returns an observable that resolves to the resulting array of album 
        // objects from getPhotoAlbumsByIdArray.  
        // Whew - that's a lot for just a few lines of code!  :)
        return url.pipe(
            switchMap(segments => this.getPhotoAlbumByPath(segments.join('/'))),
            tap(album => this.curPhotoAlbum = album),
            switchMap(album => this.getPhotoAlbumsByIdArray(album.albumIds))
        );
    };

    public getVideoAlbumByURL(url: Observable<UrlSegment[]>): Observable<VideoAlbum> {
        return url.pipe(
            switchMap(segments => this.getVideoAlbumByPath(segments.join('/'))),
            tap(album => this.curVideoAlbum = album)
        );
    };

    public getVideoAlbumsByURL(url: Observable<UrlSegment[]>): Observable<VideoAlbum[]> {
        return url.pipe(
            switchMap(segments => this.getVideoAlbumByPath(segments.join('/'))),
            tap(album => this.curVideoAlbum = album),
            switchMap(album => this.getVideoAlbumsByIdArray(album.albumIds))
        );
    };

    public getVideoByURL(url: Observable<UrlSegment[]>): Observable<Video> {
        return url.pipe(
            switchMap(segments => this.getVideoByPath(segments.join('/')))
        );
    };


}
