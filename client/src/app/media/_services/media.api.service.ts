import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, UrlSegment } from '@angular/router';
import { Observable, BehaviorSubject, Subscription, throwError } from 'rxjs';
import { switchMap, tap, take, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// imports from homesite outside of media module:
import { AlertMessageDialogComponent } from 'shared/alert-message-dialog/alert-message-dialog.component';

import { MediaAlbum, Media, Photo, Video } from '../_helpers/classes';

@Injectable({ providedIn: 'root' })
export class MediaAPIService implements OnDestroy {
    // state for subscribers:
    public curAlbum: MediaAlbum; // used to keep track of current Album between components
    // state for subscribers:
    private _thumbs$: BehaviorSubject<Media[]> = new BehaviorSubject(null);
    public readonly thumbs$ = this._thumbs$.asObservable();
    // public curAlbum: PhotoAlbum; // used to keep track of current Album between components
    // public curPhoto: Photo;
    public curVideo: Video;
    private thumbSub: Subscription;
    constructor(
        private http: HttpClient,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnDestroy() {
        this._thumbs$.unsubscribe();
        if (this.thumbSub) {
            this.thumbSub.unsubscribe();
        }
    }

    // actions on state:
    public loadThumbs(mediaType: string, url: Observable<UrlSegment[]>) {
        // If called from gallery-photo-albums component then the
        // this.curAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        this._thumbs$.next(null); // prevent any old data from displaying during load
        this.thumbSub = this.getAlbumByURL(mediaType, url)
            .pipe(
                switchMap(album => this.getMediasByIdArray(mediaType, album.mediaIds)),
                take(1),
                catchError(err => this.errAlert('error getting Thumbs', err))
            )
            .subscribe(thumbs => this._thumbs$.next(thumbs));
    }

    public getMediaById(mediaType, id: number): Observable<Photo> {
        return <Observable<Photo>>this.http.get(`/api/${mediaType}s/${mediaType}-by-id/' + id`);
    }

    public getMediaByPath(mediaType: string, path: string): Observable<Video> {
        const fullPath = '(' + path.split('/').join('+') + ')';
        return <Observable<Video>>this.http.get(`/api/${mediaType}s/${mediaType}-by-path/${fullPath}`);
    }

    public getMediaByURL(mediaType: string, url: Observable<UrlSegment[]>): Observable<Video> {
        return url.pipe(switchMap(segments => this.getMediaByPath(mediaType, segments.join('/'))));
    }

    public getMediasByIdArray(mediaType: string, medias: Array<number>): Observable<Media[]> {
        return <Observable<Media[]>>(
            this.http.get(`/api/${mediaType}s/${mediaType}s/(${medias.join('+')})`)
        );
    }

    public getThumbsByIdArray(mediaType: string, thumbIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>(
            this.http.get(`/api/${mediaType}s/thumbs/(${thumbIds.join('+')})`)
        );
    }

    // public getAlbumById(id: number): Observable<PhotoAlbum> {
    //     return <Observable<PhotoAlbum>>this.http.get('/api/photos/album-by-id/' + id);
    // }

    // public getAlbumByPath(path: string): Observable<PhotoAlbum> {
    //     let pathString = '(' + path.split('/').join('+') + ')';
    //     if (pathString === '(albums)') {
    //         pathString = '()';
    //     } // 'albums' is our root path.
    //     return <Observable<PhotoAlbum>>(
    //         this.http.get('/api/photos/album-by-path/' + pathString)
    //     );
    // }

    // public getAlbumsByIdArray(albumIds: Array<number>): Observable<PhotoAlbum[]> {
    //     const albumString = '(' + albumIds.join('+') + ')';
    //     return <Observable<PhotoAlbum[]>>this.http.get('/api/photos/albums/' + albumString);
    // }

    // public getAlbumByURL(url: Observable<UrlSegment[]>): Observable<PhotoAlbum> {
    //     // This function takes in an Observable of an UrlSegment array, joins those segments
    //     // into a path, passes that path to getAlbumsByPath.  When that resolves it saves the
    //     // resulting album into curAlbum variable (class scope).  Ultimately this function
    //     // returns an observable which resolves to the album from getAlbumByPath.
    //     return url.pipe(
    //         switchMap(segments => this.getAlbumByPath(segments.join('/'))),
    //         tap(album => (this.curAlbum = album))
    //     );
    // }

    // public getAlbumsByURL(url: Observable<UrlSegment[]>): Observable<PhotoAlbum[]> {
    //     // This function effectively collapses three observables into one: It first takes
    //     // in an observable of an UrlSegment array. When that resolves, it joins those
    //     // segments into a path, and passes that path to getAlbumsByPath (the second
    //     // observable). Once that observable resolves into an album, it then saves the result
    //     // into the curAlbum variable (class scope) and finally calls getAlbums
    //     // (the third observable) with that album's album.Albums array.  This entire method
    //     // ultimately returns an observable that resolves to the resulting array of album
    //     // objects from getAlbumsByIdArray.
    //     // Whew - that's a lot for just a few lines of code!  :)
    //     return url.pipe(
    //         switchMap(segments => this.getAlbumByPath(segments.join('/'))),
    //         tap(album => (this.curAlbum = album)),
    //         switchMap(album => this.getAlbumsByIdArray(album.albumIds))
    //     );
    // }

//    ------------------------------

    public getAlbumById(mediaType: string, id: number): Observable<MediaAlbum> {
        return <Observable<MediaAlbum>>this.http.get(`/api/${mediaType}s/album-by-id/${id}`);
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

    public getAlbumsByIdArray(mediaType: string, albumIds: Array<number>): Observable<MediaAlbum[]> {
        const albumString = `(${albumIds.join('+')})`;
        return <Observable<MediaAlbum[]>>this.http.get(`/api/${mediaType}s/albums/${albumString}`);
    }

    public getAlbumByURL(mediaType: string, url: Observable<UrlSegment[]>): Observable<MediaAlbum> {
        // This function takes in an Observable of an UrlSegment array, joins those segments
        // into a path, passes that path to getAlbumsByPath.  When that resolves it saves the
        // resulting album into curAlbum variable (class scope).  Ultimately this function
        // returns an observable which resolves to the album from getAlbumByPath.
        return url.pipe(
            switchMap(segments => this.getAlbumByPath(mediaType, segments.join('/'))),
            tap(album => this.curAlbum = album)
        );
    }

    public getAlbumsByURL(mediaType: string, url: Observable<UrlSegment[]>): Observable<MediaAlbum[]> {
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
            tap(album => this.curAlbum = album),
            switchMap(album => this.getAlbumsByIdArray(mediaType, album.albumIds))
        );
    }

    errAlert(msg: string, err): Observable<never> {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => {});
        console.log(err);
        this.router.navigate(['/home']);
        return throwError(err);
    }
}
