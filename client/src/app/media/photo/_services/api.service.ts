import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, UrlSegment } from '@angular/router';
import { Observable, BehaviorSubject, throwError, Subscription } from 'rxjs';
import { switchMap, catchError, tap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// imports from homesite outside of photo module:
import { AlertMessageDialogComponent } from '../../../shared/alert-message-dialog/alert-message-dialog.component';

import { Album, Photo } from '../_helpers/classes';

@Injectable({ providedIn: 'root' })
export class APIService implements OnDestroy {
    // state for subscribers:
    private _thumbs$: BehaviorSubject<Photo[]> = new BehaviorSubject(null);
    public readonly thumbs$ = this._thumbs$.asObservable();
    public curAlbum: Album; // used to keep track of current Album between components
    public curPhoto: Photo;
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
    public loadThumbs(url: Observable<UrlSegment[]>) {
        // If called from gallery-photo-albums component then the
        // this.curAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        this._thumbs$.next(null); // prevent any old data from displaying during load
        this.thumbSub = this.getAlbumByURL(url)
            .pipe(
                switchMap(album => this.getPhotosByIdArray(album.photoIds)),
                take(1),
                catchError(err => this.errAlert('error getting Thumbs', err))
            )
            .subscribe(thumbs => this._thumbs$.next(thumbs));
    }

    public getPhotoById(id: number): Observable<Photo> {
        return <Observable<Photo>>this.http.get('/api/photos/photo-by-id/' + id);
    }

    public getPhotosByIdArray(photos: Array<number>): Observable<Photo[]> {
        return <Observable<Photo[]>>(
            this.http.get('/api/photos/photos/(' + photos.join('+') + ')')
        );
    }

    public getThumbsByIdArray(thumbIds: Array<number>): Observable<string[]> {
        return <Observable<string[]>>(
            this.http.get('/api/photos/thumbs/(' + thumbIds.join('+') + ')')
        );
    }

    public getAlbumById(id: number): Observable<Album> {
        return <Observable<Album>>this.http.get('/api/photos/album-by-id/' + id);
    }

    public getAlbumByPath(path: string): Observable<Album> {
        let pathString = '(' + path.split('/').join('+') + ')';
        if (pathString === '(albums)') {
            pathString = '()';
        } // 'albums' is our root path.
        return <Observable<Album>>(
            this.http.get('/api/photos/album-by-path/' + pathString)
        );
    }

    public getAlbumsByIdArray(albumIds: Array<number>): Observable<Album[]> {
        const albumString = '(' + albumIds.join('+') + ')';
        return <Observable<Album[]>>this.http.get('/api/photos/albums/' + albumString);
    }

    public getAlbumByURL(url: Observable<UrlSegment[]>): Observable<Album> {
        // This function takes in an Observable of an UrlSegment array, joins those segments
        // into a path, passes that path to getAlbumsByPath.  When that resolves it saves the
        // resulting album into curAlbum variable (class scope).  Ultimately this function
        // returns an observable which resolves to the album from getAlbumByPath.
        return url.pipe(
            switchMap(segments => this.getAlbumByPath(segments.join('/'))),
            tap(album => (this.curAlbum = album))
        );
    }

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
            tap(album => (this.curAlbum = album)),
            switchMap(album => this.getAlbumsByIdArray(album.albumIds))
        );
    }

    private errAlert(msg: string, err): Observable<never> {
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
