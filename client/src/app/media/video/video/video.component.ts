import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap, UrlTree } from '@angular/router';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';

import { AlertMessageDialogComponent } from '../../../shared/alert-message-dialog/alert-message-dialog.component';
// import { AuthService } from '../../shared/_services/auth.service';

import { APIService } from '../_services/api.service';
import { Video } from '../_helpers/classes';

@Component({
    selector: 'video-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    video: Video;
    loadingAPI = true;
    loadingVideo = true;

    constructor(public api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog) { }


    ngOnInit() {
        // If called from gallery-video-albums component then the
        // media.curVideo variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        this.route.url.subscribe(segments => {
            console.log('segments passed were: ');
            console.log(segments);
        });
        if (this.api.curVideo) {
            this.video = this.api.curVideo;
            console.log('video is: ');
            console.log(this.video);
            this.loadingAPI = false;
        } else {// We need to load video from the url sent.
            this.api.getVideoByURL(this.route.url).subscribe(
                (video) => {
                    this.video = video;
                    this.loadingAPI = false;
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
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => { });
        console.log(err);
        this.router.navigate(['/user/login']);
    }


}
