import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { MatTab } from '@angular/material';

import { AppConfig } from '../app.config';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None // Had to turn off to style the .mat-tab-label height in scss
})
export class AboutComponent implements OnInit {

    constructor(public CFG: AppConfig) { }

    ngOnInit() {
    }

}
