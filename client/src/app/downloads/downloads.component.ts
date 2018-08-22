import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject } from 'rxjs';

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
  displayedColumns: string[] = ['fileId', 'filename', 'type', 'size', 'icon'];
  dataSource = new MatTableDataSource<File>();


  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(private  auth: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
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

  onRowClicked(row) {
    console.log(row);
/*    const dialogRef = this.dialog.open(EditUserDialogComponent, {
            width: '350px',
            data: {user: row}
          }); */
  }
}


