import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { VideoAlbum, Video } from '../_helpers/classes';
import { UrlSegment } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    public curVideoAlbum: VideoAlbum;
    public curVideo: Video;

    constructor(private http: HttpClient) {}

    public getVideoById(id: number): Observable<Video> {
        return <Observable<Video>>this.http.get('/api/videos/video-by-id/' + id);
    }

    public getVideoByPath(path: string): Observable<Video> {
        const fullPath = '(' + path.split('/').join('+') + ')';
        return <Observable<Video>>this.http.get('/api/videos/video-by-path/' + fullPath);
    }

    public getVideosByIdArray(photos: Array<number>): Observable<Video[]> {
        return <Observable<Video[]>>(
            this.http.get('/api/videos/videos/(' + photos.join('+') + ')')
        );
    }

    public getPostersByIdArray(posterIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>(
            this.http.get('/api/videos/posters/(' + posterIds.join('+') + ')')
        );
    }

    public getVideoAlbumByPath(path: string): Observable<VideoAlbum> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString === '(albums)') {
            pathString = '()';
        }
        return <Observable<VideoAlbum>>(
            this.http.get('/api/videos/album-by-path/' + pathString)
        );
    }

    public getVideoAlbumByURL(url: Observable<UrlSegment[]>): Observable<VideoAlbum> {
        return url.pipe(
            switchMap(segments => this.getVideoAlbumByPath(segments.join('/'))),
            tap(album => (this.curVideoAlbum = album))
        );
    }

    /*


    public getVideoAlbumsByIdArray(albumIds: Array<number>): Observable<VideoAlbum[]> {
        const albumString = '(' + albumIds.join('+') + ')';
        return <Observable<VideoAlbum[]>>(
            this.http.get('/api/videos/albums/' + albumString)
        );
    }


    public getVideoAlbumsByURL(url: Observable<UrlSegment[]>): Observable<VideoAlbum[]> {
        return url.pipe(
            switchMap(segments => this.getVideoAlbumByPath(segments.join('/'))),
            tap(album => (this.curVideoAlbum = album)),
            switchMap(album => this.getVideoAlbumsByIdArray(album.albumIds))
        );
    }
    */

    public getVideoByURL(url: Observable<UrlSegment[]>): Observable<Video> {
        return url.pipe(switchMap(segments => this.getVideoByPath(segments.join('/'))));
    }
}
