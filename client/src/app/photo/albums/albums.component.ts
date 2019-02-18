// imports from Angular and other libraries:
import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

// imports from homesite outside of photo module:
import { AlertMessageDialogComponent } from '../../alert-message-dialog/alert-message-dialog.component';

// imports from within photo module:
import { APIService } from '../_services/api.service';
import { Album, Photo } from '../_helpers/classes';

@Component({
    selector: 'photo-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

    displayAlbums: Album[];
    photosDisplayName: string;

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location) { }

    ngOnInit() {
        // this observable changes on init, or when nav button hit (back or fwd)
        this.api.getAlbumsByURL(this.route.url).subscribe(
            (albums) => {
                this.displayAlbums = albums;
                this.photosDisplayName = (this.api.curAlbum._id > 0) ? this.api.curAlbum.name: "";
            },
            (err) => this.errAlert('Problem getting albums!', err)
        );
    };

    public updateDisplayAlbum(album: Album) {
        this.api.curAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {// means this album contains other albums
            this.api.getAlbumsByIdArray(album.albumIds).subscribe(
                (albums) => { // get the albums array for this new album
                    this.displayAlbums = albums; // set albums to display
                    const url = 'photo/albums' + this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                (err) => this.errAlert('Problem getting albums!', err)
            );
        } else { // Not an album of albums!  So nav to photos ...
            this.navToPhotos(album);
        }
    };

    public navToPhotos(album: Album) {
        return this.router.navigate(['/photo/photos/' + album.path]);
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
