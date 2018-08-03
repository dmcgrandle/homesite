import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

export interface DialogData {
  alertMessage: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  hideExgPass: boolean = true; // hide existing password as dots instead of plain text
  hideNewPass: boolean = true;
  hideNewPassChk: boolean = true;
  knowExisting: boolean = false;
  existingPass : string;

  token: string;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    // This component can be called two ways:
    // 1. User clicks on link in forgot-password email sent.  Use the token
    // sent to validate the password change on the server.
    // 2. User clicks Change Password link in HeaderComponent navbar.  Use
    // current password to validate the password change on the server.
//  this.auth.user = new User;  // first clear out any old user info
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {// method 1
      this.knowExisting = false;
      this.auth.user.username = this.route.snapshot.paramMap.get('username');
    } else { // method 2
      if (!this.auth.isAuthenticated()) { this.router.navigate(['/login']) }
      this.knowExisting = true;
    }

  }

  onChangePassword(newpass: string) {
    if (this.knowExisting) {
      this.auth.user.password = this.existingPass;
      this.auth.authChangePasswordByPassword(newpass).subscribe( 
        (result: User) => this.successfulChange(result),
        (err) => this.errorChange(err)
      );
    } else {
      this.auth.user.password = newpass;
      this.auth.authChangePasswordByToken(this.token).subscribe(
        (result: User) => this.successfulChange(result),
        (err) => this.errorChange(err)
      );
    }
  }

  successfulChange(user: User) {
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
      data: {alertMessage: 'Password changed for "' + user.username + '"'}
    });
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['/login']));
    console.log("Password changed for user: " + user.username);
  }

  errorChange(err) {
    console.log(err);
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
      data: {alertMessage: err.error}
    });
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['/login']));
  }
}

/* Note: this form is simple to validate without using the built in angular
   form validity system because there are only two values on the entire form.
   See the RegisterComponent for the complicated method. :) */
