import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  heading: string;        // heading at the top of the box.  Default is "Note"
  alertMessage: string;   // the message to display
  hideCancel: boolean;    // whether to show the 'cancel' button or not
  okText: string;         // text on the "Ok" button.  Default is "Ok"
}

@Component({
  selector: 'app-alert-message-dialog',
  templateUrl: './alert-message-dialog.component.html',
  styleUrls: ['./alert-message-dialog.component.scss']
})
export class AlertMessageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    console.log(this.data);
    if (!this.data.heading) {
      this.data.heading = "Note"; // default heading
    }
    if (!this.data.okText) {
      this.data.okText = "Ok"; // default button text
    }
    console.log(this.data);
  }

  onOkClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }

  onCancelClick() {
    console.log(this.data);
    this.dialogRef.close();
  }

}
