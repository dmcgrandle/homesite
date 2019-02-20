import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

import { User } from '../_helpers/classes';
import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';

export interface DialogData {
    username: string;
}

@Component({
    selector: 'users-forgot-dialog',
    templateUrl: './forgot-dialog.component.html',
    styleUrls: ['./forgot-dialog.component.scss']
})
export class ForgotDialogComponent implements OnInit {

    token: string;
    // error: boolean = false;
    loading$: Subject<boolean> = new Subject();

    constructor(public auth: AuthService,
                public dialogRef: MatDialogRef<ForgotDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                public dialog: MatDialog) { }

    ngOnInit() {
        this.loading$.next(false);
    }

    onSubmitClick() {
        this.loading$.next(true);
        this.auth.authForgot().subscribe(
            (user: User) => {
                this.loading$.next(false);
                const alertMessage = `Email "${user.email}" was sent reset email. ` +
                    "If you don't see it in a few minutes please check your SPAM folder.";
                const dRef = this.dialog.open(AlertMessageDialogComponent, {
                    width: '400px',
                    data: { alertMessage: alertMessage, showCancel: false }
                });
                dRef.afterClosed().subscribe(() => {
                    this.dialogRef.close()
                });
            },
            (err: HttpErrorResponse) => {
                this.loading$.next(false);
                let alertMessage: string;
                if (err.status === 404) { // email not found
                    alertMessage = `Email "${this.auth.user.email}" was not found!`;
                } else {
                    alertMessage = `Error: ${err.status} ${err.statusText}`;
                }
                const dRef = this.dialog.open(AlertMessageDialogComponent, {
                    data: { heading: 'Error!', alertMessage: alertMessage, showCancel: false }
                });
                dRef.afterClosed().subscribe(() => {
                    this.dialogRef.close()
                });
            }
        );
        
    }


}
