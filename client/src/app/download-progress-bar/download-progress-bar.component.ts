import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatProgressBar, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSortable} from '@angular/material';
import { BehaviorSubject } from 'rxjs';

export interface ProgressData {
    heading: string;                          // Heading for dialog box
    stopText: string;                         // Text to use for Stop button (default: 'STOP')
    percentDone: BehaviorSubject<number>;     // Observable for stream of progress update events
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
        this.dialogRef.close({okClicked: true});
    }

}
