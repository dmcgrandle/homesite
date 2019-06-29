import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

import {
    ProgressBarComponent,
    ProgressData
} from '../progress-bar/progress-bar.component';

@Component({
    selector: 'shared-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {
    // cb must be a fat-arrow defined callback function to retain it's 'this' context of the parent component.
    @Input() cb: (file: File) => Observable<HttpEvent<any>>;
    @Output() finished = new EventEmitter<boolean>();
    uploadSub: Subscription;

    constructor(public dialog: MatDialog) {}

    ngOnDestroy() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
        }
    }

    uploadPickedFile(event) {
        // Upload clicked and file selected
        console.log('upload called with ', event.target.files[0]);
        const progress$ = new BehaviorSubject<number>(0); // start with zero progress
        const pData: ProgressData = { heading: 'Download', progress$: progress$ };
        const dialogRef = this.dialog.open(ProgressBarComponent, { data: pData });
        this.uploadSub = this.cb(event.target.files[0]).subscribe(
            progEvent => {
                // called as upload progresses
                if (progEvent.type === HttpEventType.UploadProgress) {
                    const percentDone = Math.round(
                        (100 * progEvent.loaded) / progEvent.total
                    );
                    progress$.next(percentDone); // update progress bar via observable
                    // console.log(`File is ${percentDone}% loaded.`);
                } else if (progEvent instanceof HttpResponse) {
                    // All done!
                    this.finished.emit(true);
                    dialogRef.close(); // close the progress bar
                    progress$.unsubscribe();
                    this.dialog.open(AlertMessageDialogComponent, {
                        data: {
                            heading: 'Upload Complete',
                            alertMessage: 'You successfully uploaded the file:',
                            alertMessage2: progEvent.body.filename,
                            showCancel: false
                        }
                    });
                }
            },
            err => {
                dialogRef.close();
                progress$.unsubscribe();
                console.log('Upload Error:', err);
                this.dialog.open(AlertMessageDialogComponent, {
                    width: '340px',
                    data: {
                        heading: 'Upload Error!',
                        alertMessage: err.message,
                        showCancel: false
                    }
                });
            }
        );
        dialogRef.afterClosed().subscribe(data => {
            if (data && data.stopClicked) {
                this.uploadSub.unsubscribe(); // abort the upload.
                const message = 'Transfer was aborted.';
                this.dialog.open(AlertMessageDialogComponent, {
                    width: '340px',
                    data: { heading: 'Alert!', alertMessage: message, showCancel: false }
                });
            }
        });
    }
}
