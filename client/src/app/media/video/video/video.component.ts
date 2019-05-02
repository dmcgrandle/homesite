import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { MediaAPIService } from 'media/_services/media.api.service';
import { Video } from 'media/_helpers/classes';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
    selector: 'video-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
    loadingVideo = true;
    video$: Observable<Video>;

    constructor(public api: MediaAPIService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.video$ = this.api.getMediaByURL('video', this.route.url).pipe(shareReplay(1));
    }
}
