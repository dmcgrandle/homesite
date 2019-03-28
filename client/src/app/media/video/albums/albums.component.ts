// imports from Angular and other external libraries:
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Subject } from 'rxjs';

// imports from homesite outside of video module:
import { AlertMessageDialogComponent } from '../../../shared/alert-message-dialog/alert-message-dialog.component';

// imports from within video module:
import { APIService } from '../_services/api.service';
import { VideoAlbum, Video } from '../_helpers/classes';

@Component({
    selector: 'video-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit, OnDestroy {

    displayAlbums: Array<VideoAlbum>;
    videosDisplayName: string;
    getAlbumsSub: Subscription;
    cardLoaded: Subject<HTMLDivElement> = new Subject();

    constructor(public api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location) { }

    ngOnInit() {
        // this observable changes on init, or when nav button hit (back or fwd)
        this.getAlbumsSub = this.api.getVideoAlbumsByURL(this.route.url).subscribe(
            (albums) => {
                this.displayAlbums = albums;
                this.videosDisplayName = (this.api.curVideoAlbum._id > 0) ? this.api.curVideoAlbum.name : '';
            },
            (err) => this.errAlert('Problem getting albums!', err)
        );
    }

    ngOnDestroy() {
        if (this.getAlbumsSub) { this.getAlbumsSub.unsubscribe(); }
        if (this.cardLoaded) { this.cardLoaded.unsubscribe(); }
    }

    public updateDisplayAlbum(album: VideoAlbum) {
        this.api.curVideoAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {// means this album contains other albums
            this.api.getVideoAlbumsByIdArray(album.albumIds).subscribe(
                (albums) => { // get the albums array for this new album
                    this.displayAlbums = albums; // set albums to display
                    const url = 'media/video/albums' + this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                (err) => this.errAlert('Problem getting albums!', err)
            );
        } else { // Not an album of albums!  So nav to Videoss ...
            this.navToVideos(album);
        }
    }

    public navToVideos(album: VideoAlbum) {
        return this.router.navigate(['/media/video/videos/' + album.path]);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => { });
        console.log(err);
        this.router.navigate(['/home']);
    }

}
