import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) { // unauthenticated!  Check stored credentials
      if ((this.auth.hasLoggedInBefore()) && (!this.auth.isLoginExpired())) {
        // Someone has logged in before and still has an unexpired token, so
        // go ahead and auto-login with those saved credentials.
        this.auth.user['username'] = this.auth.lastLoggedInUsername();
        this.auth.user['level'] = Number(this.auth.lastLoggedInUserLevel());
        this.auth.setAuthenticated(true);
        console.log('Auto-login for user ' + this.auth.user['username']);
      }
      else { // if not authenticated and no stored user, then login
        this.router.navigate(['/login']);
      }
    }
  }

}
