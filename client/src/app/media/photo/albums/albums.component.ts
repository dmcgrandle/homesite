// imports from Angular and other external libraries:
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Subject } from 'rxjs';

// imports from homesite outside of photo module:
import { AlertMessageDialogComponent } from '../../../shared/alert-message-dialog/alert-message-dialog.component';

// imports from within photo module:
import { APIService } from '../_services/api.service';
import { Album, Photo } from '../_helpers/classes';

@Component({
    selector: 'photo-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit, OnDestroy {
    displayAlbums: Album[];
    photosDisplayName: string;
    getAlbumsSub: Subscription;
    cardLoaded: Subject<HTMLDivElement> = new Subject();

    constructor(
        public api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location
    ) {}

    ngOnInit() {
        this.getAlbumsSub = this.api.getAlbumsByURL(this.route.url).subscribe(
            (albums: Album[]) => {
                this.displayAlbums = albums;
                this.photosDisplayName =
                    this.api.curAlbum._id > 0 ? this.api.curAlbum.name : '';
            },
            err => this.errAlert('Problem getting albums!', err)
        );
    }

    ngOnDestroy() {
        if (this.getAlbumsSub) {
            this.getAlbumsSub.unsubscribe();
        }
        if (this.cardLoaded) {
            this.cardLoaded.unsubscribe();
        }
    }

    public updateDisplayAlbum(album: Album) {
        this.api.curAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {
            // means this album contains other albums
            this.api.getAlbumsByIdArray(album.albumIds).subscribe(
                albums => {
                    this.displayAlbums = albums;
                    const url =
                        'media/photo/albums' +
                        this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                err => this.errAlert('Problem getting albums!', err)
            );
        } else {
            // Not an album of albums!  So nav to photos ...
            this.navToPhotos(album);
        }
    }

    public navToPhotos(album: Album) {
        return this.router.navigate(['/media/photo/photos/' + album.path]);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(() => {
            console.log(msg, err);
            this.router.navigate(['/home']);
        });
    }

    public makeFullscreen() {
        const i: any = document.getElementById('full-screen');
        if (i.requestFullscreen) {
            i.requestFullscreen();
        } else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
        } else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
        } else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
        }
    }
}
