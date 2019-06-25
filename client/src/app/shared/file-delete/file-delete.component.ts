import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';


@Component({
    selector: 'shared-file-delete',
    templateUrl: './file-delete.component.html',
    styleUrls: ['./file-delete.component.scss']
})
export class FileDeleteComponent implements OnInit {
    @Input() filename: string; // name of file to confirm for deletion
    @Output() confirmed = new EventEmitter<boolean>();

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    onClick() {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            data: {
                heading: 'Warning!',
                alertMessage: 'Are you certain you want to delete file:',
                alertMessage2: `"${this.filename}"`,
                showCancel: true,
                okText: 'Yes',
                cancelText: 'No'
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data && data.okClicked) {
                this.confirmed.emit(true);
            }
        });
    }
}
