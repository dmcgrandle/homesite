import { Component, OnInit, Inject, Directive, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NG_VALIDATORS, Validator, FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { EqualDirective } from '../_helpers/equal-validator';

export interface DialogData {
  username: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hidePass: boolean = true;
  hideRetype: boolean = true;

  constructor(
    private auth: AuthService,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.auth.user = new User;
  }

  onRegisterClick() {
    this.auth.authRegister().subscribe(
      (data) => {
        console.log("User " + this.auth.user['username'] + " was created successfully");
      },
      (err)=>console.log(err),
      () => {}
    );
    this.dialogRef.close();
  }
}

