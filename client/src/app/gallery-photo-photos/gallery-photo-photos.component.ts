import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VERSION } from '@angular/material';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';
import { Photo } from '../_classes/photo-classes';
import { Observable, of } from 'rxjs';

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
  selectedPhoto: Observable<any>;

  constructor(private media: MediaService,
              private router: Router, 
              public dialog: MatDialog) { }

/*
// Note: No standard (yet) in browsers for this event, so listen to all of them...
  @HostListener('document:fullscreenchange', []) // the standard ... will work someday
  @HostListener('document:webkitfullscreenchange', []) // Chrome
  @HostListener('document:mozfullscreenchange', []) // Firefox
  @HostListener('document:msfullscreenchange', []) // IE
  onFSChange() {// when minimizing back from full screen, nav back to albums
    if (!(document.fullscreenElement || document.webkitFullscreenElement 
        || document['mozFullScreenElement'] || document['msFullScreenElement'])){
      let parent = this.media.curAlbum.path.split('/').slice(0,-1).join('/');
      let url = 'albums' + this.router.createUrlTree([parent]).toString();
      this.router.navigate([url]); 
    } // This makes this component effectively live ONLY in full screen mode.
  }
*/

  ngOnInit() {
    if (this.media.curAlbum) {
      this.curPhoto = this.media.curAlbum.photos[0];
    } else {// We need to load the curAlbum from the url sent.

    }
  }

  private changePhoto(photo: Photo) {
    this.curPhoto = photo;
  }

  private highlightAndScroll(photo: Photo, e: Element) {
    if (photo === this.curPhoto) {
      e.scrollIntoView({behavior: "instant", block: "center", inline: "center"})
      return "selected"; // changes the id property of this element so css styles can outline it
    }
    return null;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode in KEY_CODE) {
      let nextIndex = 0;
      const curIndex = Number(this.media.curAlbum.photos.indexOf(this.curPhoto));
      switch (event.keyCode) { // set nextIndex to where we are going next
        case KEY_CODE.RIGHT_ARROW:
            nextIndex = (curIndex === this.media.curAlbum.photos.length-1) ? 0: curIndex + 1;
            break;
        case KEY_CODE.LEFT_ARROW: 
            nextIndex = (curIndex === 0) ? this.media.curAlbum.photos.length-1 : curIndex - 1;
            break;
        case KEY_CODE.END: 
            nextIndex = this.media.curAlbum.photos.length-1;
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
      this.curPhoto = this.media.curAlbum.photos[nextIndex];
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

}