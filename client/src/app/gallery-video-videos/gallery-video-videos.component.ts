
import { Component, EventEmitter, Directive, Output, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { MediaService } from '../shared/_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { FullscreenOverlayContainer } from '../../../node_modules/@angular/cdk/overlay';
import { Video } from '../shared/_classes/video-classes';
import { KEY_CODE } from '../shared/_classes/key-code-enum';
import { ParseTreeResult } from '../../../node_modules/@angular/compiler';

@Component({
    selector: 'app-gallery-video-videos',
    templateUrl: './gallery-video-videos.component.html',
    styleUrls: ['./gallery-video-videos.component.scss']
})
export class GalleryVideoVideosComponent implements OnInit {

    videos: Video[];

    constructor(private media: MediaService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog) { }


    ngOnInit() {
        // If called from gallery-video-albums component then the
        // media.curVideoAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        if (this.media.curVideoAlbum) {
            this.setCurrentValues(this.media.curVideoAlbum.videoIds);
        } else {// We need to load the curAlbum from the url sent.
            this.media.getVideoAlbumByURL(this.route.url).subscribe(
                (album) => this.setCurrentValues(album.videoIds),
                (err) => this.errAlert('Problem getting albums!', err)
            );
        }
    }

    playVideo(video: Video) {
        this.media.curVideo = video;
        this.route.url.subscribe(segments =>
            this.router.navigateByUrl('video/' + segments.join('/') + '/' + this.media.curVideo.filename));
    }

    private setCurrentValues(videoIds: number[]) {
        this.media.getVideosByIdArray(videoIds).subscribe(videos => this.videos = videos);
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