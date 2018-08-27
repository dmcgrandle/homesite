import { Component, Inject, OnInit, Directive, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NG_VALIDATORS, Validator, FormGroup, ValidatorFn, NgForm } from '@angular/forms';

import { User } from '../_classes/user-classes';
import { EqualDirective } from '../_helpers/equal-validator';
import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

export interface DialogData {
  user: User;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None // Had to turn off to CSS style fieldset ... ?
})
export class EditUserDialogComponent implements OnInit {

  hidePass: boolean;
  hideRetype: boolean;
  tempLevel: string;
  saveUser: User;

  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public   data: DialogData, 
                             public   auth: AuthService,
                             public dialog: MatDialog) { }

  ngOnInit() {
    this.hidePass = this.hideRetype = true;
    this.tempLevel = this.data.user.level.toString();
    this.saveUser = JSON.parse(JSON.stringify(this.data.user)); // save initial state
  }

  onSaveClick(password: string): void {
    if (password) this.data.user.password = password;
    if (Number(this.tempLevel) !== this.data.user.level) {
      this.data.user.level = Number(this.tempLevel);
    }
    this.auth.authUpdateUser(this.data.user).subscribe(
      (userReturned) => {
        const alertMessage = 'User "' + userReturned.name + '" has been successfully updated.' ;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
          width: '350px',
          data: { heading: 'Success', alertMessage: alertMessage, hideCancel: true }
        });
        dialogRef.afterClosed().subscribe(() => this.dialogRef.close());
      },
      (err)=> {
        const alertMessage = 'Error: ' + err.error;
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
          data: { alertMessage: alertMessage, hideCancel: true } });
        dialogRef.afterClosed().subscribe(() => {
          this.copyToDialogData(this.saveUser); // Restore initial state due to error
          this.dialogRef.close();
        });
      }
    );
  }

  copyToDialogData(user: User) {
    // restores the DialogData to what it was before modifications due to error
    this.data.user._id = user._id;
    this.data.user.name =  user.name;
    this.data.user.username = user.username;
    delete this.data.user.password;
    this.data.user.email =  user.email;
    this.data.user.level =  user.level;
  }

}
