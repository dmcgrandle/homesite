// imports from Angular and other external libraries:
import { 
    Component, 
    OnInit, 
    OnDestroy, 
    ViewChild, 
    ViewChildren, 
    ElementRef, 
    QueryList, 
    HostListener 
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Subject } from 'rxjs';

import { APIService } from '../_services/api.service';
import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';
import { VideoAlbum, Video } from '../_helpers/classes';


@Component({
    selector: 'video-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

    displayAlbums: Array<VideoAlbum>;
    videosDisplayName: string;
    getAlbumsSub: Subscription;
    cardLoaded: Subject<HTMLDivElement> = new Subject();


    @ViewChild('gridContainer') gridContainerRef: ElementRef;
    @ViewChild('firstItem') firstGridItemRef: ElementRef;
    @ViewChildren('nextItem') otherGridItemRefs: QueryList<ElementRef>;

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private location: Location) { }

    ngOnInit() {
        // this observable changes on init, or when nav button hit (back or fwd)
        this.getAlbumsSub = this.api.getVideoAlbumsByURL(this.route.url).subscribe(
            (albums) => {
                this.displayAlbums = albums;
                this.videosDisplayName = (this.api.curVideoAlbum._id > 0) ? this.api.curVideoAlbum.name : "";
            },
            (err) => this.errAlert('Problem getting albums!', err)
        );
        this.cardLoaded.subscribe((gridItem: HTMLDivElement) => this.setSpan(gridItem));
    };

    ngOnDestroy() {
        if (this.getAlbumsSub) this.getAlbumsSub.unsubscribe();
        if (this.cardLoaded) this.cardLoaded.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    screenResize(event: Event) {
        if (this.firstGridItemRef) this.setSpan(this.firstGridItemRef.nativeElement);
        if (this.otherGridItemRefs && this.otherGridItemRefs.length > 0) {
            this.otherGridItemRefs.forEach((gridItemRef: ElementRef) => {
                this.setSpan(gridItemRef.nativeElement);
            });
        }
    }

    private setSpan(gridItem: HTMLDivElement) {
        /* With videos they are typically either strongly landscape or portrait, so for landscape
        videos, allow them to span 2 columns to give a more equal-size effect. */
        let cardHeight = gridItem.firstElementChild.getBoundingClientRect().height;
        if (gridItem.firstElementChild.getBoundingClientRect().width > cardHeight) {
            gridItem.style.setProperty('grid-column-end', 'span 2');
            cardHeight = gridItem.firstElementChild.getBoundingClientRect().height; // it changed...
        }
        const container = this.gridContainerRef.nativeElement;
        const rowGap = parseInt(getComputedStyle(container).getPropertyValue('grid-row-gap'));
        const rowHeight = parseInt(getComputedStyle(container).getPropertyValue('grid-auto-rows'));
        const itemsGutter = Math.ceil(rowGap ? 0 : (10 / rowHeight)); // add a 10px gutter if rowGap === 0
        const span = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap)) + itemsGutter;
        gridItem.style.setProperty('grid-row-end', `span ${span}`);

    }

    public updateDisplayAlbum(album: VideoAlbum) {
        this.api.curVideoAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {// means this album contains other albums
            this.api.getVideoAlbumsByIdArray(album.albumIds).subscribe(
                (albums) => { // get the albums array for this new album
                    this.displayAlbums = albums; // set albums to display
                    const url = 'video/albums' + this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                (err) => this.errAlert('Problem getting albums!', err)
            );
        } else { // Not an album of albums!  So nav to Videoss ...
            this.navToVideos(album);
        }
    };

    public navToVideos(album: VideoAlbum) {
        return this.router.navigate(['/video/videos/' + album.path]);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(result => { });
        console.log(err);
        this.router.navigate(['/home']);
    };

}
