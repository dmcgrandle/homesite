import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../user/_services/auth.service';
import { AppConfig } from '../../app.config';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(public auth: AuthService, public CFG: AppConfig) { }

    ngOnInit() {

    }

}
