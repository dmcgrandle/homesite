import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/_services/auth.service';
import { AppConfig } from '../app.config';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor(public auth: AuthService,
        public CFG: AppConfig) { }

    ngOnInit() {
    }

}
