import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { AppConfig } from '../app.config';
import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { ForgotDialogComponent } from '../forgot-dialog/forgot-dialog.component';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    hide: boolean = true;

    constructor(public CFG: AppConfig,
        public auth: AuthService,
        public dialog: MatDialog,
        private router: Router) { }

    ngOnInit() {
        this.auth.user = new User;
        if ((this.auth.hasLoggedInBefore()) && (!this.auth.isLoginExpired())) {
            // Someone has logged in before and still has an unexpired token, so
            // go ahead and auto-login with those saved credentials.
            this.auth.user['username'] = this.auth.lastLoggedInUsername();
            this.auth.user['level'] = Number(this.auth.lastLoggedInUserLevel());
            this.router.navigate(['/gallery']);
            console.log('Auto-login for user ' + this.auth.user['username']);
        }
    };

    onLogin(password: string) {
        // Note: I stopped binding password to auth.user.password since the auth service 
        // changes that value outside the form.  Keeping it unbound keeps the UI clean.
        this.auth.user.password = password;
        this.auth.authLogin().subscribe(
            () => {
                console.log("User " + this.auth.user['username'] + " is logged in");
                let earlierAttempt = this.auth.getAttemptedURL();
                if (earlierAttempt) { // there was an URL that was attempted without auth
                    this.auth.clearAttemptedURL();
                    this.router.navigate([earlierAttempt]); // now we can load it!
                } else {
                    this.router.navigate(['/gallery']);
                }
            },
            (err) => {
                const alertMessage = 'Problem logging on: ' + err.error;
                const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                    width: '400px',
                    data: { alertMessage: alertMessage, showCancel: false }
                });
                dialogRef.afterClosed().subscribe(result => { });
                console.log(err);
                this.router.navigate(['/login']);
            },
            () => { }
        );
    };

    onSubmitClick() {
        this.auth.authForgot().subscribe(
            (userReturned) => {
                const alertMessage = 'Email "' + userReturned['email'] + '" was sent reset email. ' +
                    "If you don't see it in a few minutes please check your SPAM folder.";
                const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
                    width: '400px',
                    data: { alertMessage: alertMessage }
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
    }


    openRegisterDialog(): void {
        const dialogRef = this.dialog.open(RegisterComponent, {
            //      width: '600px',
            data: { name: this.auth.user['username'] }
        });
    }

    openForgotDialog(): void {
        const dialogRef = this.dialog.open(ForgotDialogComponent, {
            width: '460px',
            data: { name: this.auth.user['email'] }
        });
    }


}
