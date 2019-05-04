// imports from Angular and other external libraries:
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

// imports from within photo module:
import { MediaAPIService } from '../_services/media-api.service';
import { MediaAlbum } from '../_helpers/classes';

@Component({
    selector: 'media-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit, OnDestroy {
    photosDisplayName: string;
    cardLoaded$: Subject<HTMLDivElement> = new Subject();
    mediaType: string;
    spanColumns = 'false';

    constructor(
        public api: MediaAPIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location
    ) {}

    ngOnInit() {
        this.mediaType = this.location.path().split('/')[2]; // photo or video
        if (this.mediaType === 'video') {
            this.spanColumns = 'true';
        }
        this.api.updateAlbumsByUrl(this.mediaType, this.route.url);
    }

    ngOnDestroy() {
        if (this.cardLoaded$) {
            this.cardLoaded$.unsubscribe();
        }
    }

    public updateDisplayAlbum(album: MediaAlbum) {
        this.api.curAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {
            // this album contains other albums
            this.api.getAlbumsByIdArray(this.mediaType, album.albumIds).subscribe(
                albums => {
                    this.api.updateAlbums(albums);
                    const url = `/media/${
                        this.mediaType
                    }/albums${this.router.createUrlTree([album.path]).toString()}`;
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                err => this.api.errAlert('Problem getting albums!', err)
            );
        } else {
            // Not an album of albums!  So nav to photos ...
            this.navToMedia(album);
        }
    }

    public navToMedia(album: MediaAlbum) {
        return this.router.navigate([
            `/media/${this.mediaType}/${this.mediaType}s/` + album.path
        ]);
    }
}
