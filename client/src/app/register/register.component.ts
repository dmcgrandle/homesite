import { Component, OnInit, Inject, Directive, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NG_VALIDATORS, Validator, FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { EqualDirective } from '../_helpers/equal-validator';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

export interface DialogData {
    alertMessage: string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    hidePass: boolean = true;
    hideRetype: boolean = true;

    constructor(private auth: AuthService,
        public dialogRef: MatDialogRef<RegisterComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit() {
        this.auth.user = new User;
    }

    onRegisterClick() {
        this.auth.authRegister()
            .subscribe(user => {
                const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                    width: '350px',
                    data: {
                        alertMessage: 'User "' + user.username + '" was registered.\n'
                            + 'Please allow a few days for the website administrator to activate this account.',
                        showCancel: false
                    }
                });
                dialogRef.afterClosed().subscribe(() => this.dialogRef.close()); // close both at once
            },
                (err) => {
                    const alertMessage = 'Error: ' + err.error;
                    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                        data: { alertMessage: alertMessage, showCancel: false }
                    });
                    dialogRef.afterClosed().subscribe(() => {
                        this.auth.user = new User; // start fresh after error
                        this.dialogRef.close();
                    });
                }
            );
    }
}
