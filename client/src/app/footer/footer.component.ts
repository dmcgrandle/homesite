import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private auth: AuthService,
              public CFG: AppConfig) { }

  ngOnInit() { }

}
