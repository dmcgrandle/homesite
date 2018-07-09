import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  hidePassword: boolean = true;
  hidePassCheck: boolean = true;
  token: string;
  alertMessage: string;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.auth.user = {};  // first clear out any old user info
    this.auth.user['username'] = this.route.snapshot.paramMap.get('username');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onChangePassword() {
    this.auth.authChangePassword(this.token).subscribe(
      (result) => {
        this.alertMessage = 'Password changed for "' + this.auth.user['username'] + '"';
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
          data: {alertMessage: this.alertMessage}
        });
        dialogRef.afterClosed().subscribe(result => {});
        console.log("Password changed for user: " + this.auth.user['username']);
        this.router.navigate(['/login']);
      },
      (err)=>console.log(err),
      () => {}
    );
  }

}
