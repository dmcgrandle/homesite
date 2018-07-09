import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { AuthService } from '../_services/auth.service';

export interface DialogData {
  username: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hidePass: boolean = true;

  constructor(
    private auth: AuthService,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

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
