import { Component } from '@angular/core';

import { AppConfig } from '../../app.config';

@Component({
    selector: 'core-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(public CFG: AppConfig) { }

}
