import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, pipe, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AES, enc } from 'crypto-ts';

import { AppConfig } from '../app.config';
import { Album, Photo } from '../_classes/photo-classes';
import { User } from '../_classes/user-classes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authenticated: boolean = false;
//  private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  user: User;

  constructor(private http: HttpClient,
              public   CFG: AppConfig) {
  // set up default starting values
    localStorage.setItem('userId', "-1"); //no user logged in to start with
  }

  public isAuthenticated(): boolean {
//    return this._authenticated.value;
    return !this.isLoginExpired();
  }

  public setAuthenticated (value: boolean) {
//    this._authenticated.next(value);
    this._authenticated = value;
  }

  public authLogin(): Observable<Object> {
    // before transmitting user object to server for authentication, encrypt pw
    this.user.password = this.encryptPass(this.user.password);
    return this.http.post('/api/users/login', this.user).pipe(
      tap(res => this.storeUserResponse(res)),
      tap(() => this.setAuthenticated(true)),
      shareReplay()
    );
  }

  public authRegister(): Observable<Object> {
    this.user.password = this.encryptPass(this.user.password);
    return this.http.post('/api/users/create', this.user).pipe(
      shareReplay()
    );
  }

  public authForgot(): Observable<Object> {
    return this.http.post('/api/users/forgot', this.user).pipe(
      shareReplay()
    );
  }

  public authChangePassword(token: string): Observable<Object> {
    this.user.password = this.encryptPass(this.user.password);
    let body = this.user; // http body to send will be the user and the token
    body['token'] = token;
    return this.http.post('/api/users/changepassword', body).pipe(
      shareReplay()
    );
  }

  public getToken(): string {
    return localStorage.getItem('jwtToken');
  }

  public isLoginExpired(): boolean {
    let tokenTimeRemaining = Number(localStorage.getItem('expiresAt')) - Math.round(Date.now()/1000);
    return (tokenTimeRemaining < 300); // If less than 5 mins (300s) remaining, log in again.
  }

  public hasLoggedInBefore(): boolean {
    return (localStorage.getItem('successfulLogin') === 'true');
  }

  public lastLoggedInUsername(): string {
    return localStorage.getItem('username');
  }

  public lastLoggedInUserLevel(): string {
    return localStorage.getItem('level');
  }

  public authLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('level');
    localStorage.removeItem('expiresAt');
    this.setAuthenticated(false);
    this.user = new User;
  }

  private encryptPass(password) {
    return AES.encrypt(password, this.CFG.const.auth.password_secret).toString();
  }

  private storeUserResponse(res) {
    localStorage.setItem('username', this.user['username']);
    localStorage.setItem('jwtToken', res.jwtToken);
    localStorage.setItem('level', res.level);
    localStorage.setItem('expiresAt', res.expiresAt);
    localStorage.setItem('successfulLogin', 'true');
/*  console.log('userId: ' + localStorage.getItem('userId'));
    console.log('jwtToken: ' + localStorage.getItem('jwtToken'));
    console.log('level: ' + localStorage.getItem('level'));
    console.log('expiresAt: ' + localStorage.getItem('expiresAt')); */
  }

}
