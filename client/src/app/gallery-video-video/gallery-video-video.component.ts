import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap, UrlTree } from '@angular/router';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';
import { Video } from '../_classes/video-classes';

@Component({
  selector: 'app-gallery-video-video',
  templateUrl: './gallery-video-video.component.html',
  styleUrls: ['./gallery-video-video.component.scss']
})
export class GalleryVideoVideoComponent implements OnInit {

  video: Video;
  loading : boolean = true;

  constructor(private  media: MediaService,
              private  route: ActivatedRoute,
              private router: Router, 
              public  dialog: MatDialog) { }


  ngOnInit() {
    // If called from gallery-video-albums component then the
    // media.curVideo variable will already be set up. If not
    // we were probably called by a browser typed link or refresh.
    this.route.url.subscribe(segments => {
      console.log('segments passed were: ');
      console.log(segments);
    })
    if (this.media.curVideo) {
      this.video = this.media.curVideo;
      console.log('video is: ');
      console.log(this.video);
      this.loading = false;
    } else {// We need to load video from the url sent.
      this.media.getVideoByURL(this.route.url).subscribe(
        (video) => {
          this.video = video;
          this.loading = false;
          console.log('video is:');
          console.log(video);
        },
        (err) => this.errAlert('Problem getting video!', err)
      );

    }
  }

  private errAlert(msg: string, err) {
    const alertMessage = msg + err.error;
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
      width: '400px',
      data: {alertMessage: alertMessage, showCancel: false}
    });
    dialogRef.afterClosed().subscribe(result => {});
    console.log(err);
    this.router.navigate(['/login']);
  };


}
