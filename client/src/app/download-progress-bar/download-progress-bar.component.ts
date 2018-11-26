import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatProgressBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

export interface ProgressData {
    heading: string;                          // Heading for dialog box
    stopText: string;                         // Text to use for Stop button (default: 'STOP')
    progress$: BehaviorSubject<number>;       // Observable for progress updates
}

@Component({
    selector: 'app-download-progress-bar',
    templateUrl: './download-progress-bar.component.html',
    styleUrls: ['./download-progress-bar.component.scss']
})
export class DownloadProgressBarComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DownloadProgressBarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProgressData) { }

    ngOnInit() {
        if (!this.data.heading) {
            this.data.heading = 'Upload'; // default heading
        }
        if (!this.data.stopText) {
            this.data.stopText = 'STOP';
        }
    }

    onStopClick(): void {
        this.dialogRef.close({stopClicked: true});
    }

}
