import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { File } from '../_classes/fs-classes';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  loading$ = new BehaviorSubject<boolean>(true); // will be getting initial table
  displayedColumns: string[] = ['fileId', 'downloadIcon', 'filename', 'icon', 'type', 'size'];
  dataSource = new MatTableDataSource<File>();


  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(private  auth: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    if (this.auth.lastLoggedInUserLevel() > 2) { // add the delete Icon if user level is high enough
      this.displayedColumns = ['fileId', 'downloadIcon', 'deleteIcon', 'filename', 'icon', 'type', 'size'];
    }
    this.dataSource.paginator = this.paginator;
    this.auth.authGetDownloads()
    .subscribe(downloads => {
      this.dataSource.data = downloads;
      this.loading$.next(false);
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDownloadClicked(file: File) {
    this.auth.downloadFile(file).subscribe(
      blob => saveAs(blob, file.filename),
      err => console.log(err),
      () => console.log('Downloaded file: ' + file.filename)
    );
  }

  onDeleteClicked(row) {
    console.log('Delete clicked for:');
    console.log(row);
  }


  onRowClicked(row) {
    console.log(row);
/*    const dialogRef = this.dialog.open(EditUserDialogComponent, {
            width: '350px',
            data: {user: row}
          }); */
  }
}


