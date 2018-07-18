import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VERSION } from '@angular/material';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';


@Component({
  selector: 'app-gallery-photo-photos',
  templateUrl: './gallery-photo-photos.component.html',
  styleUrls: ['./gallery-photo-photos.component.scss']
})
export class GalleryPhotoPhotosComponent implements OnInit {

  version = VERSION;

  constructor(private media: MediaService,
              private router: Router, 
              public dialog: MatDialog) { }

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
  
    ngOnInit() {
    // immediately jump to full screen mode for this component
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

  public openDialog() {
    const alertMessage = 'working!';
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
      width: '400px',
      data: {alertMessage: alertMessage}
    });
    dialogRef.afterClosed().subscribe(result => {});
    }

}
