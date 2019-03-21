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
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Subject } from 'rxjs';

// imports from homesite outside of photo module:
import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';

// imports from within photo module:
import { APIService } from '../_services/api.service';
import { Album, Photo } from '../_helpers/classes';

@Component({
    selector: 'photo-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit, OnDestroy {

    displayAlbums: Album[];
    photosDisplayName: string;
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
        this.getAlbumsSub = this.api.getAlbumsByURL(this.route.url).subscribe(
            (albums: Album[]) => {
                this.displayAlbums = albums;
                this.photosDisplayName = (this.api.curAlbum._id > 0) ? this.api.curAlbum.name: "";
            },
            (err) => this.errAlert('Problem getting albums!', err)
        );
        // triggered from the template when an image has loaded.
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
        /* When image has loaded or screen resized, the card is complete and the masonry layout 
        can be finished by adding 'grid-row-end: span <num>' to the gridItem's style see:
        https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb */
        const cardHeight = gridItem.firstElementChild.getBoundingClientRect().height;
        const container = this.gridContainerRef.nativeElement;
        const rowGap = parseInt(getComputedStyle(container).getPropertyValue('grid-row-gap'));
        const rowHeight = parseInt(getComputedStyle(container).getPropertyValue('grid-auto-rows'));
        const itemsGutter = Math.ceil(rowGap ? 0 : (10 / rowHeight)); // add a 10px gutter if rowGap === 0
        const span = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap)) + itemsGutter;
        gridItem.style.setProperty('grid-row-end', `span ${span}`);

    }

    public updateDisplayAlbum(album: Album) {
        this.api.curAlbum = album; // go down one level (directory).
        if (album.albumIds.length > 0) {// means this album contains other albums
            this.api.getAlbumsByIdArray(album.albumIds).subscribe(
                (albums) => {
                    this.displayAlbums = albums;
                    const url = 'photo/albums' + this.router.createUrlTree([album.path]).toString();
                    this.location.go(url); // Update the URL in the browser window without navigating.
                },
                (err) => this.errAlert('Problem getting albums!', err)
            );
        } else { // Not an album of albums!  So nav to photos ...
            this.navToPhotos(album);
        }
    };

    public navToPhotos(album: Album) {
        return this.router.navigate(['/photo/photos/' + album.path]);
    }

    private errAlert(msg: string, err) {
        const alertMessage = msg + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            width: '400px',
            data: { alertMessage: alertMessage, showCancel: false }
        });
        dialogRef.afterClosed().subscribe(() => {
            console.log(msg, err);
            this.router.navigate(['/home']);
        });
    };

}
