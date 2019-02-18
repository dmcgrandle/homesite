import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { ParseTreeResult } from '@angular/compiler';

import { APIService } from '../_services/api.service';
import { AlertMessageDialogComponent } from '../../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { Video } from '../_helpers/classes';
import { KEY_CODE } from '../../shared/_classes/key-code-enum';

@Component({
    selector: 'video-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

    videos: Video[];

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog) { }


    ngOnInit() {
        // If called from gallery-video-albums component then the
        // api.curVideoAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        if (this.api.curVideoAlbum) {
            this.setCurrentValues(this.api.curVideoAlbum.videoIds);
        } else {// We need to load the curAlbum from the url sent.
            this.api.getVideoAlbumByURL(this.route.url).subscribe(
                (album) => this.setCurrentValues(album.videoIds),
                (err) => this.errAlert('Problem getting albums!', err)
            );
        }
    }

    playVideo(video: Video) {
        this.api.curVideo = video;
        this.route.url.subscribe(segments =>
            this.router.navigateByUrl('/video/video/' + segments.join('/') + '/' + this.api.curVideo.filename));
    }

    private setCurrentValues(videoIds: number[]) {
        this.api.getVideosByIdArray(videoIds).subscribe(videos => this.videos = videos);
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