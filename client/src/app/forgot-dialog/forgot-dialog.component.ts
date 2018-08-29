import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

export interface DialogData {
    username: string;
}

@Component({
    selector: 'app-forgot-dialog',
    templateUrl: './forgot-dialog.component.html',
    styleUrls: ['./forgot-dialog.component.scss']
})
export class ForgotDialogComponent implements OnInit {

    token: string;
    error: boolean = false;

    constructor(
        private auth: AuthService,
        public dialogRef: MatDialogRef<ForgotDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    onSubmitClick() {
        this.auth.authForgot().subscribe(
            (userReturned) => {
                const alertMessage = 'Email "' + userReturned['email'] + '" was sent reset email. ' +
                    "If you don't see it in a few minutes please check your SPAM folder.";
                const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                    width: '400px',
                    data: { alertMessage: alertMessage, showCancel: false }
                });
                dialogRef.afterClosed().subscribe(result => { });
            },
            (err) => {
                const alertMessage = 'Email "' + this.auth.user['email'] + '" was not found!';
                const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                    data: { alertMessage: alertMessage, showCancel: false }
                });
                dialogRef.afterClosed().subscribe(result => { });
            },
            () => { }
        );
        this.dialogRef.close();
    }


}
