import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { MediaAPIService } from 'media/_services/media-api.service';
import { Video } from 'media/_helpers/classes';
import { shareReplay } from 'rxjs/operators';

@Component({
    selector: 'video-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
    videos$: Observable<Video[]>;
    posterLoaded: Subject<HTMLDivElement> = new Subject();

    constructor(
        public api: MediaAPIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        // We need to load the curAlbum from the url sent.
        this.videos$ = this.api
            .getMediasByURL('video', this.route.url)
            .pipe(shareReplay(1));
    }

    ngOnDestroy() {
        this.posterLoaded.unsubscribe();
    }

    playVideo(video: Video) {
        // this.api.curVideo = video;
        this.route.url.subscribe(segments =>
            this.router.navigateByUrl(
                `/media/video/video/${segments.join('/')}/${video.filename}`
            )
        );
    }
}
