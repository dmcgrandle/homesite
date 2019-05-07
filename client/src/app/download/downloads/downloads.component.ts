import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { saveAs } from 'file-saver';

import {
    AlertMessageDialogComponent,
    AlertData
} from 'shared/alert-message-dialog/alert-message-dialog.component';
import {
    ProgressBarComponent,
    ProgressData
} from 'shared/progress-bar/progress-bar.component';
import { DlFile, FilenameChangedObj } from '../_helpers/classes';
import { APIService } from '../_services/api.service';

@Component({
    selector: 'download-downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit, OnDestroy {
    loading$ = new BehaviorSubject<boolean>(true);
    displayedColumns: string[];
    dataSource = new MatTableDataSource<DlFile>();
    dlFilename: string;
    currentScreenWidth = '';
    flexMediaWatcher: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public api: APIService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private flexMedia: MediaObserver
    ) {}

    ngOnInit() {
        // This component can be called two ways (techniques):
        // 1. with a specified download in the URL, so simply download to the user
        // 2. without a specified download, so display all downloads available
        this.route.paramMap.subscribe(params => {
            this.dlFilename = params.get('download');
            if (this.dlFilename) {
                // technique 1
                this.onDownloadClicked(<DlFile>{
                    fullPath: `/protected/downloads/${this.dlFilename}`,
                    filename: this.dlFilename
                });
                this.router.navigate(['/download']); // Enter again (re-Init) without file specified
            } else {
                // technique 2
                this.flexMediaWatcher = this.flexMedia.media$.subscribe(
                    (change: MediaChange) => {
                        this.currentScreenWidth = change.mqAlias;
                        this.setupDownloadsTable();
                    }
                ); // set up a watcher to make columns in DownloadsTable responsive
                this.setupDownloadsTable();
            }
        });
    }

    ngOnDestroy() {
        if (this.flexMediaWatcher) {
            this.flexMediaWatcher.unsubscribe();
        }
        this.loading$.unsubscribe();
    }

    setupDownloadsTable() {
        this.displayedColumns = ['fileId', 'downloadIcon'];
        if (this.api.lastLoggedInUserLevel() >= 3) {
            // add the delete Icon if user level is high enough
            this.displayedColumns.push('deleteIcon');
        }
        if (this.currentScreenWidth === 'xs') {
            // only display a few icons
            this.displayedColumns.shift(); // remove 'fileId' on small screens
            this.displayedColumns = this.displayedColumns.concat([
                'linkIcon',
                'filename'
            ]);
        } else {
            // add all columns on larger screens
            this.displayedColumns = this.displayedColumns.concat([
                'linkIcon',
                'filename',
                'icon',
                'type',
                'sizeHR'
            ]);
        }
        if (this.sort && this.dataSource.data.length === 0) {
            // only need to load defaults on first init
            this.dataSource.paginator = this.paginator;
            // this.sort.sort(<MatSortable>{ id: 'filename', start: 'asc' });
            this.dataSource.sort = this.sort;
            this.reloadDownloads();
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onDownloadClicked(file: DlFile) {
        let download: Subscription;
        const progress$ = new BehaviorSubject<number>(0); // start with zero progress
        const pData: ProgressData = { heading: 'Download', progress$: progress$ };
        const dialogRef = this.dialog.open(ProgressBarComponent, { data: pData });
        download = this.api.downloadFile(file).subscribe(
            event => {
                // console.log('event is ', event)
                if (event.type === HttpEventType.DownloadProgress) {
                    const percentDone = Math.round((100 * event.loaded) / event.total);
                    progress$.next(percentDone); // update progress bar via observable
                    // console.log(`File is ${percentDone}% downloaded.`);
                } else if (event instanceof HttpResponse) {
                    // All done!
                    console.log('Downloaded file :', file.filename);
                    // console.log('event is ', event);
                    console.log(event);
                    saveAs(event.body, file.filename);
                    dialogRef.close(); // close the progress bar
                    const alertData: AlertData = {
                        heading: 'Download Complete',
                        alertMessage: 'You successfully downloaded the file:',
                        alertMessage2: file.filename,
                        showCancel: false
                    };
                    this.dialog.open(AlertMessageDialogComponent, { data: alertData });
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
                download.unsubscribe(); // abort the upload.
                const message = 'Download was aborted.';
                this.dialog.open(AlertMessageDialogComponent, {
                    data: { heading: 'Alert!', alertMessage: message, showCancel: false }
                });
            }
        });
    }

    onFilenameChange(filenameChanged: FilenameChangedObj) {
        this.api.renameFile(filenameChanged).subscribe((file: DlFile) => {
            const alertData: AlertData = {
                heading: 'Rename Successful',
                alertMessage: `old file: ${filenameChanged.oldFilename}`,
                alertMessage2: `is now: ${file.filename}`,
                showCancel: false
            };
            this.dialog.open(AlertMessageDialogComponent, { data: alertData });
            const i = this.dataSource.data.findIndex(
                el => el._id === filenameChanged._id
            );
            this.dataSource.data[i] = file;
        });
    }

    onLinkClicked(file: DlFile) {
        // This whole function is such a hack.  It's amazing there isn't a better way
        // to access the clipboard in Angular ... that I could find ...
        const url = document.URL + this.router.createUrlTree([file.filename]).toString();
        // create a "fake" textarea to store text and then copy to clipboard from
        const clipArea = document.createElement('textarea');
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
                showCancel: false
            }
        });
    }

    onDeleteClicked(file: DlFile) {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            //           width: '360px', // commented this out so long filenames wouldn't wrap
            data: {
                heading: 'Warning!',
                alertMessage: 'Are you certain you want to delete file:',
                alertMessage2: `"${file.filename}"`,
                showCancel: true,
                okText: 'Yes',
                cancelText: 'No'
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data.okClicked) {
                this.api.deleteFile(file).subscribe(returnedFile => {
                    console.log('Deleted file ' + returnedFile.filename);
                    this.reloadDownloads();
                });
            } // if cancel clicked, do nothing.
        });
    }

    reloadDownloads() {
        this.loading$.next(true);
        this.api.authGetDownloads().subscribe(downloads => {
            this.dataSource.data = downloads;
            this.loading$.next(false);
        });
    }
}
