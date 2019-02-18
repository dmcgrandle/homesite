// imports from Angular and other libraries:
import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VERSION } from '@angular/material';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';

// imports from homesite outside of photo module:
import { AuthService } from '../../shared/_services/auth.service';
import { KEY_CODE } from '../../shared/_classes/key-code-enum';
import { AlertMessageDialogComponent } from '../../alert-message-dialog/alert-message-dialog.component';

// imports from within photo module:
import { Photo } from '../_helpers/classes';
import { APIService } from '../_services/api.service';


@Component({
    selector: 'photo-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss']
})

export class PhotosComponent implements OnInit {

    //  version = VERSION;
    photos: Photo[];
    curPhotoIndex: number;

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog) { }

    ngOnInit() {
        // If called from gallery-photo-albums component then the
        // api.curAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        if (this.api.curAlbum) {
            this.setCurrentValues(this.api.curAlbum.photoIds);
        } else {// We need to load the curAlbum from the url sent.
            this.api.getAlbumByURL(this.route.url).subscribe(
                (album) => this.setCurrentValues(album.photoIds),
                (err) => this.errAlert('Problem getting albums!', err)
            );
        }
    }

    private setCurrentValues(photoIds: number[]) {
        this.api.getPhotosByIdArray(photoIds).subscribe(photos => this.photos = photos);
        this.curPhotoIndex = 0; //start at first photo
    }

    private changePhoto(newPhoto: Photo) {
        this.curPhotoIndex = this.photos.findIndex(photo => photo._id === newPhoto._id);
    }

    private highlightAndScroll(photo: Photo, thumbE: Element, thumbsE: Element) {
        // Only property we can scroll with is scrollLeft which is in PIXELS, so need
        // to calculate how many thumbs in the current window and where the center
        // is, then convert all that to pixels to calculate the amount to scroll.
        // Originally tried to use scrollIntoView, but that scrolled vertically as
        // well which messed up the screen depending on client browser window size.
        if (photo._id === this.photos[this.curPhotoIndex]._id) {
            const thumbWidth = thumbE.scrollWidth + 6; // 6 is the border width
            const windowWidth = thumbsE.clientWidth; // visible thumbnails window
            const numThumbsDisplayed = windowWidth / thumbWidth - 1;
            const numThumbsToLeftOfCenter = this.curPhotoIndex - numThumbsDisplayed / 2;
            thumbsE.scrollLeft = numThumbsToLeftOfCenter * thumbWidth;
            // thumbE.scrollIntoView({behavior: "instant", block: "center", inline: "center"})
            return "selected"; // changes the id property of this element so css styles can outline it
        }
        return null;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.keyCode in KEY_CODE) {
            let nextIndex = 0;
            switch (event.keyCode) { // set nextIndex to where we are going next
                case KEY_CODE.RIGHT_ARROW:
                case KEY_CODE.DOWN_ARROW:
                    nextIndex = (this.curPhotoIndex === this.api.curAlbum.photoIds.length - 1) ? 0 : this.curPhotoIndex + 1;
                    break;
                case KEY_CODE.LEFT_ARROW:
                case KEY_CODE.UP_ARROW:
                    nextIndex = (this.curPhotoIndex === 0) ? this.api.curAlbum.photoIds.length - 1 : this.curPhotoIndex - 1;
                    break;
                case KEY_CODE.END:
                    nextIndex = this.api.curAlbum.photoIds.length - 1;
                    break;
                case KEY_CODE.HOME:
                    nextIndex = 0;
                    break;
                case KEY_CODE.PAGE_UP:
                    //            console.log('Pressed PAGE_UP');
                    break;
                case KEY_CODE.PAGE_DOWN:
                    //            console.log('Pressed PAGE_DOWN');
                    break;
            }
            this.curPhotoIndex = nextIndex;
            //      this.api.getPhotoById(this.api.curAlbum.photoIds[nextIndex])
            //        .subscribe(photo => this.curPhotoIndex = photo);
        }
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