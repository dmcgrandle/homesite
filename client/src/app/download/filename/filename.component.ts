import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FilenameChangedObj } from '../_helpers/classes';

@Component({
    selector: 'download-filename',
    templateUrl: './filename.component.html'
})
export class FilenameComponent {
    @Input() id: number;
    @Input() filename: string;
    @Output() changed = new EventEmitter<FilenameChangedObj>();

    constructor() {}

    valueChanged(name: string): void {
        if (name !== this.filename) {
            const filenameChanged: FilenameChangedObj = {
                _id: this.id,
                oldFilename: this.filename,
                newFilename: name
            };
            this.changed.emit(filenameChanged);
            this.filename = name;
        }
    }
}
