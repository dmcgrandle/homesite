import { Component, OnInit, Inject, Directive, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SHA256 } from 'crypto-ts';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { NG_VALIDATORS, Validator, FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

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

// Set up the directive for a custom form validation - "password" and "retype" password.
// Using template driven forms, so need a custom @Directive to create a selector for use
// in the form.  Note: this selector is applied as an attribute in the form GROUP 
// (note the ngModelGroup="passGroup" in the template).  That way all the formGroup input
// fields will be sent in the FormControl object injected into the function within the 
// factory - yeah, the syntax is a bit confusing for this...
@Directive({
  selector: '[equal]',
  providers: [{provide: NG_VALIDATORS, useExisting: EqualDirective, multi: true}]
})
// This class has one property, a constructor that sets that property, and the required
// validate() function (required by the Validator interface).
export class EqualDirective implements Validator {
  validator: ValidatorFn;
  constructor () {
    this.validator = validateEqualFactory();
  }
  validate(c: FormGroup) {
    return this.validator(c);
  }
}

// This factory function simply returns a function.  The inner function is the one that
// has the FormGroup object injected into it - note it is a FormGroup object because we
// need both the password AND the retry passed to us (these are the only two elements in
// the ngModelGroup="passGroup") in order to compare them.  This can be used generically
// though, so I mapped password to first and retry to second.
function validateEqualFactory() : ValidatorFn {
  return (c: FormGroup) => {
    const [first, second] = Object.keys(c.value || {}); // Deconstruct array syntax
    const valid = (c.value[first] === c.value[second])
    return (valid) ? null : { equal: {valid: false}}
  }
}