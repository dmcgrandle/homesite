import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSortable} from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { DlFile } from '../_classes/fs-classes';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  loading$ = new BehaviorSubject<boolean>(true); // will be getting initial table
  displayedColumns: string[] = ['fileId', 'downloadIcon', 'filename', 'icon', 'type', 'sizeHR'];
  dataSource = new MatTableDataSource<DlFile>();


  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(private   auth: AuthService, 
              public  dialog: MatDialog,
              private router: Router) {}

  ngOnInit() {
    if (this.auth.lastLoggedInUserLevel() > 2) { // add the delete Icon if user level is high enough
      this.displayedColumns = ['fileId', 'downloadIcon', 'deleteIcon', 'filename', 'icon', 'type', 'sizeHR'];
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

  onDeleteClicked(row) {
    console.log('Delete clicked for:');
    console.log(row);
    this.auth.deleteFile(row).subscribe(
      file => {
        console.log('file deleted was ', file);
        this.reloadDownloads();
      }
    )
  }

  uploadFile(event) {// Upload clicked and file selected
    console.log('File is "' + event.target.files[0].name + '"');
    this.auth.uploadFile(event.target.files[0]).subscribe(
      event => { // called as upload progresses
        if (event.type == HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          console.log(`File is ${percentDone}% loaded.`);
        } else if (event instanceof HttpResponse) { // All done!
          console.log('File is completely uploaded!');
          this.reloadDownloads();
        }
      },
      err => console.log('Upload Error: ', err),
      () => console.log('Upload done.')
    )
  }

  onRowClicked(row) {
    console.log(row);
/*    const dialogRef = this.dialog.open(EditUserDialogComponent, {
            width: '350px',
            data: {user: row}
          }); */
  }

  reloadDownloads() {
    this.loading$.next(true);
    this.auth.authGetDownloads().subscribe(downloads => {
      this.dataSource.data = downloads;
      this.loading$.next(false);
    })
  }
}


