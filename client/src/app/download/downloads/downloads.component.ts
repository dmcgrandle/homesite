import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

import {
    AlertMessageDialogComponent,
    AlertData
} from 'shared/alert-message-dialog/alert-message-dialog.component';
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
        // private route: ActivatedRoute,
        private router: Router,
        private flexMedia: MediaObserver
    ) {}

    ngOnInit() {
        // This component can be called two ways (techniques):
        // 1. with a specified download in the URL, so simply download to the user
        // 2. without a specified download, so display all downloads available
        // this.route.paramMap.subscribe(params => {
        //     this.dlFilename = params.get('download');
        //     if (this.dlFilename) {
        //         // technique 1
        //         this.onDownloadClicked(<DlFile>{
        //             fullPath: `/protected/downloads/${this.dlFilename}`,
        //             filename: this.dlFilename
        //         });
        //         this.router.navigate(['/download']); // Enter again (re-Init) without file specified
        //     } else {
        // technique 2
        this.flexMediaWatcher = this.flexMedia.media$.subscribe(
            (change: MediaChange) => {
                this.currentScreenWidth = change.mqAlias;
                this.setupDownloadsTable();
            }
        ); // set up a watcher to make columns in DownloadsTable responsive
        this.setupDownloadsTable();
            // }
        // });
    }

    ngOnDestroy() {
        // if (this.flexMediaWatcher) {
        this.flexMediaWatcher.unsubscribe();
        // }
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

    // Note - need to define this as a fat-arrow function to retain it's 'this' context:
    uploadCB: (file: File) => Observable<HttpEvent<any>> = (file: File) => this.api.uploadFile(file);

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
        const url = `${document.URL}/file${this.router.createUrlTree([file.filename]).toString()}`;
        // create a "fake" textarea to store text and then copy to clipboard from
        console.log('url is: ', url);
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

    onDeleteConfirmed(file: DlFile) {
        this.api.deleteFile(file).subscribe(returnedFile => {
            console.log('Deleted file ' + returnedFile.filename);
            this.reloadDownloads();
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
