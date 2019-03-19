// imports from external:
import { Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { share, switchMap, catchError, tap } from 'rxjs/operators';

// imports from homesite outside of photo module:
import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';

// imports from within photo module:
import { Photo } from '../_helpers/classes';
import { APIService } from '../_services/api.service';

@Component({
    selector: 'photo-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss']
})

export class PhotosComponent implements OnInit {

    thumbs$: Observable<Photo[]>;
    curThumbsIndex: number = 0;
    focalLoading: boolean = true;
    @ViewChild('largeCard') largeCardRef: ElementRef;
    @ViewChild('imageContainer') imageContainerRef: ElementRef;

    constructor(private api: APIService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog) { }

    ngOnInit() {
        // If called from gallery-photo-albums component then the
        // api.curAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        if (this.api.curAlbum) {
            this.thumbs$ = this.api.getPhotosByIdArray(this.api.curAlbum.photoIds);
        } else {// We need to load the album from the url sent to get the thumbs
            this.thumbs$ = this.api.getAlbumByURL(this.route.url).pipe(
                switchMap(album => this.api.getPhotosByIdArray(album.photoIds)),
            );
        }
        this.thumbs$ = this.thumbs$.pipe(
            catchError(err => {
                console.error('error is', err);
                return throwError(err); // TODO: handle error with user dialog
            }),
            share()
        );
    }

    private changeThumb(newIndex: number) {// event 'thumbChanged' in template
        this.curThumbsIndex = newIndex;
        this.focalLoading = true;
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