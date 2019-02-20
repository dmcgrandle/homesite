import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject, of, observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';
// import { PhotoAlbum, Photo } from '../photo/_helpers/photo-classes';
import { User } from '../_helpers/classes';
import { AuthService } from '../_services/auth.service';
import { catchError, finalize, tap, startWith, switchMap } from 'rxjs/operators';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
    selector: 'users-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    loading$ = new BehaviorSubject<boolean>(true); // will be getting initial table
    displayedColumns: string[] = ['userId', 'name', 'username', 'email', 'level'];
    dataSource = new MatTableDataSource<User>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private auth: AuthService, public dialog: MatDialog) { }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.auth.authGetUsers()
            .subscribe(users => {
                this.dataSource.data = users;
                this.loading$.next(false);
            })
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onRowClicked(row) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '350px',
            data: { user: row }
        });
    }
}
