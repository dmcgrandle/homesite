import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { APIService } from '../_services/api.service';
import { AlertMessageDialogComponent } from 'shared/alert-message-dialog/alert-message-dialog.component';
import { Video } from '../_helpers/classes';

@Component({
    selector: 'video-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
    videos: Video[];
    posterLoaded: Subject<HTMLDivElement> = new Subject();

    constructor(
        public api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
    // We need to load the curAlbum from the url sent.
        this.api
            .getVideoAlbumByURL(this.route.url)
            .subscribe(
                album => this.setCurrentValues(album.mediaIds),
                err => this.errAlert('Problem getting albums!', err)
            );
    }

    ngOnDestroy() {
        this.posterLoaded.unsubscribe();
    }

    playVideo(video: Video) {
        this.api.curVideo = video;
        this.route.url.subscribe(segments =>
            this.router.navigateByUrl(
                '/media/video/video/' +
                    segments.join('/') +
                    '/' +
                    this.api.curVideo.filename
            )
        );
    }

    private setCurrentValues(mediaIds: number[]) {
        this.api.getVideosByIdArray(mediaIds).subscribe(videos => this.videos = videos);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => {});
        console.log(err);
        this.router.navigate(['/home']);
    }
}
