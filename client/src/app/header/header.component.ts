import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material';

import { AuthService } from '../_services/auth.service';
import { AppConfig } from '../app.config';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private auth: AuthService, public CFG: AppConfig) { }

    ngOnInit() {

    }

}
