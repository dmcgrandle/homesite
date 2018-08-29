import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSortable} from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { DownloadProgressBarComponent } from '../download-progress-bar/download-progress-bar.component';
import { DlFile } from '../_classes/fs-classes';
import { AuthService } from '../_services/auth.service';


@Component({
    selector: 'app-downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

    loading$ = new BehaviorSubject<boolean>(true); // will be getting initial table
    displayedColumns: string[];
    dataSource = new MatTableDataSource<DlFile>();

    @ViewChild(MatPaginator) paginator: MatPaginator; 
    @ViewChild(MatSort) sort: MatSort;

    constructor(private   auth: AuthService, 
                public  dialog: MatDialog,
                private router: Router) {}

    ngOnInit() {
        this.displayedColumns = ['fileId', 'downloadIcon']; 
        if (this.auth.lastLoggedInUserLevel() >= 3) { // add the delete Icon if user level is high enough
            this.displayedColumns.push('deleteIcon');
        }
        if (window.innerWidth < 600) { // xs screensize, so only display a few icons
            this.displayedColumns.shift(); // remove 'fieldId' on small screens
            this.displayedColumns = this.displayedColumns.concat(['filename']);
        } else { // add all columns on larger screens
            this.displayedColumns = this.displayedColumns.concat(['filename', 'icon', 'type', 'sizeHR']);
        }
        this.dataSource.paginator = this.paginator;
        this.sort.sort(<MatSortable>{ id: 'filename', start: 'asc'});
        this.dataSource.sort = this.sort;
        this.reloadDownloads();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onDownloadClicked(file: DlFile) {
        this.auth.downloadFile(file).subscribe(
            blob => saveAs(blob, file.filename),
            err => console.log(err),
            () => console.log('Downloaded file: ' + file.filename)
        );
    }

    onDeleteClicked(file) {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
 //           width: '360px', // commented this out so long filenames wouldn't wrap
            data: { 
                heading: 'Warning!',
                alertMessage: 'Are you certain you want to delete file:',
                alertMessage2: '"' + file.filename + '"', 
                showCancel: true, 
                okText: 'Yes', 
                cancelText: 'No' 
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data.okClicked) {
                this.auth.deleteFile(file).subscribe(
                    file => {
                        console.log('Deleted file '+ file.filename);
                        this.reloadDownloads();
                    }
                )
            } // if cancel clicked, do nothing.
        });
    }

    uploadFile(event) {// Upload clicked and file selected
        let progress$ = new BehaviorSubject<number>(0); // start with zero progress
        const dialogRef = this.dialog.open(DownloadProgressBarComponent, {
            width: '360px',
            data: { progress$: progress$ }
        });
        let upload = this.auth.uploadFile(event.target.files[0]).subscribe(
            event => { // called as upload progresses
                if (event.type == HttpEventType.UploadProgress) {
                    const percentDone = Math.round(100 * event.loaded / event.total);
                    progress$.next(percentDone); // update progress bar via observable
//                    console.log(`File is ${percentDone}% loaded.`);
                } else if (event instanceof HttpResponse) { // All done!
                    console.log('Uploaded file :', event.body.filename);
                    this.reloadDownloads();
                    dialogRef.close(); // close the progress bar
                }
            },
            err => console.log('Upload Error: ', err)
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

    reloadDownloads() {
        this.loading$.next(true);
        this.auth.authGetDownloads().subscribe(downloads => {
            this.dataSource.data = downloads;
            this.loading$.next(false);
        })
    }
}


