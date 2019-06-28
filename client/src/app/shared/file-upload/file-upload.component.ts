import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
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
export class FileUploadComponent {
    @Input() uploadFile: Function; // eg: api.uploadFile(event.target.files[0])
    @Input() that: any; // "this" context of original uploadFile function to bind
    @Output() finished = new EventEmitter<boolean>();

    constructor(public dialog: MatDialog) {}

    uploadPickedFile(event) {
        // Upload clicked and file selected
        console.log('upload called with ', event.target.files[0]);
        let upload: Subscription;
        const progress$ = new BehaviorSubject<number>(0); // start with zero progress
        const pData: ProgressData = { heading: 'Download', progress$: progress$ };
        const dialogRef = this.dialog.open(ProgressBarComponent, { data: pData });
        // since we passed a function from a service, bind to the original 'this'
        const boundUpload = this.uploadFile.bind(this.that);
        upload = boundUpload(event.target.files[0]).subscribe(
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
                upload.unsubscribe(); // abort the upload.
                const message = 'Transfer was aborted.';
                this.dialog.open(AlertMessageDialogComponent, {
                    width: '340px',
                    data: { heading: 'Alert!', alertMessage: message, showCancel: false }
                });
            }
        });
    }
}
