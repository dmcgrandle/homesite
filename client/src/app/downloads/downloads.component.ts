import { Component, OnInit, ViewChild, ViewChildren, HostListener } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSortable } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';

import { AppConfig } from '../app.config';
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

    loading$ = new BehaviorSubject<boolean>(true);
    displayedColumns: string[];
    dataSource = new MatTableDataSource<DlFile>();
    dlFilename: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public CFG: AppConfig,
        private auth: AuthService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        // This component can be called:
        // 1. with a specified download in the URL, so simply download to the user
        // 2. without a specified download, so display all downloads available
        this.dlFilename = this.route.snapshot.paramMap.get('download');
        if (this.dlFilename) { // method 1
            this.auth.setAttemptedURL(this.router.url); // store this in case we need to be logged in
            this.auth.downloadFile(<DlFile>{fullPath: '/protected/downloads/' + this.dlFilename}).subscribe(
                blob => {
                    saveAs(blob, this.dlFilename);
                    this.auth.clearAttemptedURL(); // we succeeded to save the file, so clear the attempt
                },
                err => console.log(err),
                () => console.log('Downloaded file: ' + this.dlFilename)
            );
            this.router.navigate(['/downloads']);
        } else { // method 2
            this.displayedColumns = ['fileId', 'downloadIcon'];
            if (this.auth.lastLoggedInUserLevel() >= 3) { // add the delete Icon if user level is high enough
                this.displayedColumns.push('deleteIcon');
            }
            if (window.innerWidth < 600) { // xs screensize, so only display a few icons
                this.displayedColumns.shift(); // remove 'fieldId' on small screens
                this.displayedColumns = this.displayedColumns.concat(['linkIcon', 'filename']);
            } else { // add all columns on larger screens
                this.displayedColumns = this.displayedColumns.concat(['linkIcon', 'filename', 'icon', 'type', 'sizeHR']);
            }
            this.dataSource.paginator = this.paginator;
            this.sort.sort(<MatSortable>{ id: 'filename', start: 'asc' });
            this.dataSource.sort = this.sort;
            this.reloadDownloads();
        }
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

    copyToClipboard(clipArea: HTMLTextAreaElement) {
        console.log('clipArea changed ...');
        clipArea.focus();
        clipArea.select();
        document.execCommand('copy');
        clipArea.textContent = '';
        console.log('getSelection is ', document.getSelection());
        document.getSelection().removeAllRanges;
        // this.hideClipArea = true;
    }


    onLinkClicked(file: DlFile) {
        // This whole function is such a hack.  It's amazing there isn't a better way
        // to access the clipboard in Angular ...
        let url = document.URL + this.router.createUrlTree([file.filename]).toString();
        // create a "fake" textarea to store text and then copy to clipboard from
        let clipArea = document.createElement('textarea');
        clipArea.style.position = 'fixed'; // out of the flow
        clipArea.style.left = '0';
        clipArea.style.top = '0';
        clipArea.style.opacity = '0'; // so there is no flicker
        clipArea.textContent = url; // store text in the fake
        document.body.appendChild(clipArea);
        clipArea.select(); // select the fake text to be copied 
        document.execCommand('copy'); // finally actually copy to clipboard!
        document.body.removeChild(clipArea); // get rid of the fake
        this.dialog.open(AlertMessageDialogComponent, {
            data: {
                heading: 'Link',
                alertMessage: 'This link was copied to the clipboard:',
                alertMessage2: url,
                showCancel: false,
            }
        });
    }

    onDeleteClicked(file: DlFile) {
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
                        console.log('Deleted file ' + file.filename);
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
                    // console.log(`File is ${percentDone}% loaded.`);
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


