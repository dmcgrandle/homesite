import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VERSION } from '@angular/material';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';
import { Photo } from '../_classes/photo-classes';
import { Observable, of } from 'rxjs';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '../../../node_modules/@angular/cdk/overlay/typings/keyboard/overlay-keyboard-dispatcher';

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

  version = VERSION;
  curPhoto: Photo;
  curThumbs: string[];
//  selectedPhoto: Observable<any>;

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
    this.media.getPhotoById(photos[0]).subscribe(
      photo => this.curPhoto = photo
    );
    this.media.getThumbsByIdArray(photos).subscribe(
      thumbs => this.curThumbs = thumbs
    );
  }

  private changePhoto(photo: Photo) {
    this.curPhoto = photo;
  }

  private highlightAndScroll(photoId: number, e: Element) {
    if (photoId === this.curPhoto._id) {
      e.scrollIntoView({behavior: "instant", block: "center", inline: "center"})
      return "selected"; // changes the id property of this element so css styles can outline it
    }
    return null;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode in KEY_CODE) {
      let nextIndex = 0;
      const curIndex = Number(this.curPhoto._id);
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
      this.media.getPhotoById(nextIndex).subscribe(photo => this.curPhoto = photo);
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