import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject, of, observable } from 'rxjs';
import { delay } from 'rxjs/operators';

// import { MediaService } from '../shared/_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
// import { PhotoAlbum, Photo } from '../photo/_helpers/photo-classes';
import { User } from '../shared/_classes/user-classes';
import { AuthService } from '../shared/_services/auth.service';
import { catchError, finalize, tap, startWith, switchMap } from '../../../node_modules/rxjs/operators';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { nextTick } from '../../../node_modules/@types/q';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

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
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
            width: '350px',
            data: { user: row }
        });
    }
}
