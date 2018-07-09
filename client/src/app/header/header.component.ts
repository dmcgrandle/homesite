import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { LoginComponent } from '../login/login.component';
import { MatMenuModule } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
