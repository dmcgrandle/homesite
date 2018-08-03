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
//  levelControl: FormControl;

  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public   data: DialogData, 
                             public   auth: AuthService,
                             public dialog: MatDialog) { }

  ngOnInit() {
    this.hidePass = this.hideRetype = true;
    this.tempLevel = this.data.user.level.toString();
//    this.levelControl = new FormControl(this.tempLevel, [Validators.required]);
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
          data: {alertMessage: alertMessage}
        });
        dialogRef.afterClosed().subscribe(result => {});
      },
      (err)=> {
        const alertMessage = 'Error updating user!';
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
          data: {alertMessage: alertMessage}
        });
        dialogRef.afterClosed().subscribe(result => {});
      },
      () => {}
    );
    this.dialogRef.close();
    }

}
