import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface AlertData {
    heading?: string; // heading at the top of the box.  Default is "Note"
    alertMessage: string; // the message to display
    alertMessage2?: string; // optional second line to display
    showCancel: boolean; // whether to show the 'cancel' button or not
    okText?: string; // optional text on the "Ok" button.  Default is "Ok"
    cancelText?: string; // optional text on the "Cancel" button.  Default is "Cancel"
}

@Component({
    selector: 'shared-alert-message-dialog',
    templateUrl: './alert-message-dialog.component.html',
    styleUrls: ['./alert-message-dialog.component.scss']
})
export class AlertMessageDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AlertMessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AlertData
    ) {}

    ngOnInit() {
        // set defaults
        if (!this.data.heading) {
            this.data.heading = 'Note';
        }
        if (!this.data.okText) {
            this.data.okText = 'Ok';
        }
        if (!this.data.cancelText) {
            this.data.cancelText = 'Cancel';
        }
    }

    onOkClick(): void {
        // if cancel was clicked the return object won't be set
        this.dialogRef.close({ okClicked: true });
    }
}
