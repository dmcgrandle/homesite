import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VERSION } from '@angular/material';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';
import { Photo } from '../_classes/photo-classes';

Event

export enum KEY_CODE {
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  END = 35,
  HOME = 36,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39
};

@Component({
  selector: 'app-gallery-photo-photos',
  templateUrl: './gallery-photo-photos.component.html',
  styleUrls: ['./gallery-photo-photos.component.scss']
})

export class GalleryPhotoPhotosComponent implements OnInit {

//  version = VERSION;
  curPhoto: Photo;
  curThumbs: string[];

  constructor(private  media: MediaService,
              private  route: ActivatedRoute,
              private router: Router, 
              public  dialog: MatDialog) { }

  ngOnInit() {
    // If called from gallery-photo-albums component then the
    // media.curPhotoAlbum variable will already be set up. If not
    // we were probably called by a browser typed link or refresh.
    if (this.media.curPhotoAlbum) {
      this.setCurrentValues(this.media.curPhotoAlbum.photos);
    } else {// We need to load the curAlbum from the url sent.
      this.media.getPhotoAlbumByURL(this.route.url).subscribe(
        (album) => this.setCurrentValues(album.photos),
        (err) => this.errAlert('Problem getting albums!', err)
      );
    }
  }

  private setCurrentValues(photos: number[]) {
    this.media.getPhotoById(photos[0]).subscribe(photo => this.curPhoto = photo);
    this.media.getThumbsByIdArray(photos).subscribe(thumbs => this.curThumbs = thumbs);
  }

  private changePhoto(photoId: number) {
    this.media.getPhotoById(photoId).subscribe(photo => this.curPhoto = photo);
  }

  private highlightAndScroll(photoId: number, thumbE: Element, thumbsE: Element) {
    // Only property we can scroll with is scrollLeft which is in PIXELS, so need
    // to calculate how many thumbs in the current window and where the center
    // is, then convert all that to pixels to calculate the amount to scroll.
    // Originally tried to use scrollIntoView, but that scrolled vertically as
    // well which messed up the screen depending on client browser window size.
    if (photoId === this.curPhoto._id) {
      const thumbIndex = this.media.curPhotoAlbum.photos.indexOf(photoId);
      const thumbWidth = thumbE.scrollWidth + 6; // 6 is the border width
      const windowWidth = thumbsE.clientWidth; // visible thumbnails window
      const numThumbsDisplayed = windowWidth/thumbWidth - 1;
      const numThumbsToLeftOfCenter = thumbIndex - numThumbsDisplayed/2;
      thumbsE.scrollLeft = numThumbsToLeftOfCenter*thumbWidth;
//      thumbE.scrollIntoView({behavior: "instant", block: "center", inline: "center"})
      return "selected"; // changes the id property of this element so css styles can outline it
    }
    return null;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode in KEY_CODE) {
      let nextIndex = 0;
      const curIndex = this.media.curPhotoAlbum.photos.indexOf(this.curPhoto._id);
      switch (event.keyCode) { // set nextIndex to where we are going next
        case KEY_CODE.RIGHT_ARROW:
            nextIndex = (curIndex === this.media.curPhotoAlbum.photos.length-1) ? 0: curIndex + 1;
            break;
        case KEY_CODE.LEFT_ARROW: 
            nextIndex = (curIndex === 0) ? this.media.curPhotoAlbum.photos.length-1 : curIndex - 1;
            break;
        case KEY_CODE.END: 
            nextIndex = this.media.curPhotoAlbum.photos.length-1;
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
      this.media.getPhotoById(this.media.curPhotoAlbum.photos[nextIndex])
        .subscribe(photo => this.curPhoto = photo);
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
      data: {alertMessage: alertMessage}
    });
    dialogRef.afterClosed().subscribe(result => {});
    console.log(err);
    this.router.navigate(['/gallery']);
  };


}