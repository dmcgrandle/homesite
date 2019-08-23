import { Component, ViewEncapsulation } from '@angular/core';

import { AppConfig } from 'app.config';

@Component({
    selector: 'family-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None // Had to turn off to style the .mat-tab-label height in scss
})
export class AboutComponent {
    step = 0; // For the accordian selection

    constructor(public CFG: AppConfig) {}

    setStep(index: number) {
        this.step = index;
    }
}
