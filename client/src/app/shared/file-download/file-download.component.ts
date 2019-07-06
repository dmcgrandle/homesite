import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { saveAs } from 'file-saver';

import {
    AlertMessageDialogComponent,
    AlertData
} from '../alert-message-dialog/alert-message-dialog.component';
import {
    ProgressBarComponent,
    ProgressData
} from '../progress-bar/progress-bar.component';

@Component({
    selector: 'shared-file-download',
    templateUrl: './file-download.component.html',
    styleUrls: ['./file-download.component.scss']
})
export class FileDownloadComponent implements OnDestroy {
    @Input() download$: Observable<HttpEvent<any>>; // Observable to use for downloading eg: api.downloadFile(file)
    @Input() name: string;
    @Output() finished: EventEmitter<boolean> = new EventEmitter();
    downloadSub: Subscription;

    constructor(public dialog: MatDialog) {}

    ngOnDestroy() {
        if (this.downloadSub) {
            this.downloadSub.unsubscribe();
        }
    }

    onClick() {
        const progress$ = new BehaviorSubject<number>(0); // start with zero progress
        const pData: ProgressData = { heading: 'Download', progress$: progress$ };
        const dialogRef = this.dialog.open(ProgressBarComponent, { data: pData });
        this.downloadSub = this.download$.subscribe(
            event => {
                // console.log('event is ', event)
                if (event.type === HttpEventType.DownloadProgress) {
                    const percentDone = Math.round((100 * event.loaded) / event.total);
                    progress$.next(percentDone); // update progress bar via observable
                    // console.log(`File is ${percentDone}% downloaded.`);
                } else if (event instanceof HttpResponse) {
                    // All done!
                    console.log('Downloaded file :', this.name);
                    // console.log('event is ', event);
                    console.log(event);
                    saveAs(event.body, this.name);
                    dialogRef.close(); // close the progress bar
                    const alertData: AlertData = {
                        heading: 'Download Complete',
                        alertMessage: 'You successfully downloaded the file:',
                        alertMessage2: this.name,
                        showCancel: false
                    };
                    const ref = this.dialog.open(AlertMessageDialogComponent, { data: alertData });
                    ref.afterClosed().subscribe(() => this.finished.next(true));
                }
            },
            err => {
                dialogRef.close();
                console.log('Download Error:', err);
                const alertData: AlertData = {
                    heading: 'Download Error!',
                    alertMessage: err.message,
                    showCancel: false
                };
                this.dialog.open(AlertMessageDialogComponent, { data: alertData });
            }
        );
        dialogRef.afterClosed().subscribe(data => {
            if (data && data.stopClicked) {
                this.downloadSub.unsubscribe(); // abort the upload.
                const message = 'Download was aborted.';
                this.dialog.open(AlertMessageDialogComponent, {
                    width: '340px',
                    data: { heading: 'Alert!', alertMessage: message, showCancel: false }
                });
            }
        });
    }
}
