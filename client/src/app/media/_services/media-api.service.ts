import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, UrlSegment } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// imports from homesite outside of media module:
import { AlertMessageDialogComponent } from 'shared/alert-message-dialog/alert-message-dialog.component';
import { AppConfig } from 'app.config';

import { MediaAlbum, Media } from '../_helpers/classes';

@Injectable({ providedIn: 'root' })
export class MediaAPIService implements OnDestroy {
    private _albums$: BehaviorSubject<MediaAlbum[]> = new BehaviorSubject(null);
    public readonly albums$: Observable<MediaAlbum[]> = this._albums$.asObservable();
    public curAlbum: MediaAlbum;

    constructor(
        private http: HttpClient,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnDestroy() {
        this._albums$.unsubscribe();
    }

    public updateAlbums(albums: MediaAlbum[]) {
        this._albums$.next(albums);
    }

    public getMediaById(mediaType, id: number): Observable<Media> {
        return <Observable<Media>>(
            this.http.get(`/api/${mediaType}s/${mediaType}-by-id/${id}`)
        );
    }

    public getMediaByFullpath(mediaType: string, path: string): Observable<Media> {
        const fullPath = '(' + path.split('/').join('+') + ')';
        return <Observable<Media>>(
            this.http.get(`/api/${mediaType}s/${mediaType}-by-fullpath/${fullPath}`)
        );
    }

    public getMediaByURL(
        mediaType: string,
        url: Observable<UrlSegment[]>
    ): Observable<Media> {
        return url.pipe(
            switchMap(segments => this.getMediaByFullpath(mediaType, segments.join('/')))
        );
    }

    public getMediasByIdArray(
        mediaType: string,
        medias: Array<number>
    ): Observable<Media[]> {
        return <Observable<Media[]>>(
            this.http.get(`/api/${mediaType}s/${mediaType}s/(${medias.join('+')})`)
        );
    }

    public getMediasByURL(
        mediaType: string,
        url: Observable<UrlSegment[]>
    ): Observable<Media[]> {
        return this.getAlbumByURL(mediaType, url).pipe(
            switchMap(album => this.getMediasByIdArray(mediaType, album.mediaIds))
        );
    }

    public getAlbumById(mediaType: string, id: number): Observable<MediaAlbum> {
        return <Observable<MediaAlbum>>(
            this.http.get(`/api/${mediaType}s/album-by-id/${id}`)
        );
    }

    public getAlbumByPath(mediaType: string, path: string): Observable<MediaAlbum> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString === '(albums)') {
            pathString = '()';
        } // 'albums' is root path.
        return <Observable<MediaAlbum>>(
            this.http.get(`/api/${mediaType}s/album-by-path/${pathString}`)
        );
    }

    public getAlbumsByIdArray(
        mediaType: string,
        albumIds: Array<number>
    ): Observable<MediaAlbum[]> {
        const albumString = `(${albumIds.join('+')})`;
        return <Observable<MediaAlbum[]>>(
            this.http.get(`/api/${mediaType}s/albums/${albumString}`)
        );
    }

    public getAlbumByURL(
        mediaType: string,
        url: Observable<UrlSegment[]>
    ): Observable<MediaAlbum> {
        // This function takes in an Observable of an UrlSegment array, joins those segments
        // into a path, passes that path to getAlbumsByPath.  When that resolves it saves the
        // resulting album into curAlbum variable (class scope).  Ultimately this function
        // returns an observable which resolves to the album from getAlbumByPath.
        return url.pipe(
            switchMap(segments => this.getAlbumByPath(mediaType, segments.join('/'))),
            tap(album => (this.curAlbum = album))
        );
    }

    public getAlbumsByURL(
        mediaType: string,
        url: Observable<UrlSegment[]>
    ): Observable<MediaAlbum[]> {
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
            switchMap(segments => this.getAlbumByPath(mediaType, segments.join('/'))),
            tap(album => (this.curAlbum = album)),
            switchMap(album => this.getAlbumsByIdArray(mediaType, album.albumIds))
        );
    }

    errAlert(msg: string, err): Observable<never> {
        const alertMessage = msg + err.error;
        this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        console.log(err);
        this.router.navigate(['/home']);
        return throwError(err);
    }
}
