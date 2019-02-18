import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { APIService } from '../_services/api.service';
import { AlertMessageDialogComponent } from '../../alert-message-dialog/alert-message-dialog.component';
import { VideoAlbum, Video } from '../_helpers/classes';


@Component({
    selector: 'video-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit, AfterViewInit {

    displayAlbums: Array<VideoAlbum>;
    videosDisplayName: string;

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location) { }

    ngOnInit() {
        // this observable changes on init, or when nav button hit (back or fwd)
        this.api.getVideoAlbumsByURL(this.route.url).subscribe(
            (albums) => {
                this.displayAlbums = albums;
                if (this.api.curVideoAlbum._id > 0) {
                    this.videosDisplayName = this.api.curVideoAlbum.name;
                } else {
                    this.videosDisplayName = ""
                }
            },
            (err) => this.errAlert('Problem getting albums!', err)
        );
    };

    ngAfterViewInit() {

    }

    public updateDisplayAlbum(album: VideoAlbum) {
        this.api.curVideoAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {// means this album contains other albums
            this.api.getVideoAlbumsByIdArray(album.albumIds).subscribe(
                (albums) => { // get the albums array for this new album
                    this.displayAlbums = albums; // set albums to display
                    const url = 'video/albums' + this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                (err) => this.errAlert('Problem getting albums!', err)
            );
        } else { // Not an album of albums!  So nav to Videoss ...
            this.navToVideos(album);
        }
    };

    public navToVideos(album: VideoAlbum) {
        return this.router.navigate(['/video/videos/' + album.path]);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => { });
        console.log(err);
        this.router.navigate(['/gallery']);
    };

}
