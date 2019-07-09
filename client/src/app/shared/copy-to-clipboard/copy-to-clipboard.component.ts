import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';

@Component({
    selector: 'shared-copy-to-clipboard',
    templateUrl: './copy-to-clipboard.component.html'
})
export class CopyToClipboardComponent implements OnInit {
    @Input() text: string;
    @Input() makeUrl: boolean;
    @Output() finished = new EventEmitter<boolean>();

    constructor(private router: Router, public dialog: MatDialog) {}

    ngOnInit() {}

    onClick() {
        // This whole function is such a hack.  It's amazing there isn't a better way
        // to access the clipboard in Angular ... that I could find ...
        let newText: string;
        if (this.makeUrl) {
            newText = `${document.URL}/file${this.router
                .createUrlTree([this.text])
                .toString()}`;
        } else {
            newText = this.text;
        }
        // create a "fake" textarea to store text and then copy to clipboard from
        const clipArea = document.createElement('textarea');
        clipArea.style.position = 'fixed'; // out of the flow
        clipArea.style.left = '0';
        clipArea.style.top = '0';
        clipArea.style.opacity = '0'; // so there is no flicker
        clipArea.textContent = newText; // store text in the fake
        document.body.appendChild(clipArea);
        clipArea.select(); // select the fake text to be copied
        document.execCommand('copy'); // finally actually copy to clipboard!
        document.body.removeChild(clipArea); // get rid of the fake
        const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
            data: {
                heading: 'COPIED',
                alertMessage: 'This was copied to the clipboard:',
                alertMessage2: newText,
                showCancel: false
            }
        });
        dialogRef.afterClosed().subscribe(() => this.finished.emit(true));
    }
}
