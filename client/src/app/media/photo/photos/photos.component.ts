// imports from external:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

// imports from within photo module:
import { Photo } from 'media/_helpers/classes';
import { MediaAPIService } from 'media/_services/media-api.service';

@Component({
    selector: 'photo-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
    // state for children:
    curThumbsIndex = 0;
    focalLoading = true;
    thumbs$: Observable<Photo[]>;

    constructor(public api: MediaAPIService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.thumbs$ = this.api
            .getMediasByURL('photo', this.route.url)
            .pipe(shareReplay(1));
    }

    private changeThumb(newIndex: number) {
        // event 'thumbChanged' in template
        this.curThumbsIndex = newIndex;
        this.focalLoading = true;
    }

    public makeFullscreen(e: any) {
        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        } else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        }
    }
}
