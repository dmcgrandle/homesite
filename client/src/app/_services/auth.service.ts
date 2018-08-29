import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, pipe, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { AES } from 'crypto-ts';

import { AppConfig } from '../app.config';
import { PhotoAlbum, Photo } from '../_classes/photo-classes';
import { User } from '../_classes/user-classes';
import { DlFile } from '../_classes/fs-classes';
import { LoginResponse } from '../_classes/server-response-classes';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: User;

  constructor(private http: HttpClient,
              public   CFG: AppConfig) {
  // set up default starting values
    if (!this.user && this.isAuthenticated()) {// user must have refreshed, so reset user
      this.user = new User;
      this.user.username = this.lastLoggedInUsername();
      this.user.level = this.lastLoggedInUserLevel();
    }
  }

  public isAuthenticated(): boolean {
    return !this.isLoginExpired();
  }

  public authLogin(): Observable<LoginResponse> {
    // before transmitting user object to server for authentication, encrypt pw
    this.user.password = this.encryptPass(this.user.password);
    return <Observable<LoginResponse>>this.http.post('/api/users/login', this.user).pipe(
      tap((res : LoginResponse) => {
        this.storeLoginResponse(res);
        this.user.level = res.level;
      }),
      shareReplay()
    );
  }

  public authRegister(): Observable<User> {
    this.user.password = this.encryptPass(this.user.password);
    return this.http.post<User>('/api/users/create', this.user).pipe(shareReplay());
  }

  public authForgot(): Observable<Object> {
    return this.http.post('/api/users/forgot', this.user).pipe(shareReplay());
  }

  public authChangePasswordByToken(token: string): Observable<User> {
    this.user.password = this.encryptPass(this.user.password);
    let body = this.user;
    body['token'] = token; // Add token to the object to send to the server
    return <Observable<User>>this.http.post('/api/users/changepw-by-token', body).pipe(shareReplay());
  }

  public authChangePasswordByPassword(newPassword: string): Observable<User> {
    this.user.password = this.encryptPass(this.user.password);
    let body = this.user;
    body['newPassword'] = this.encryptPass(newPassword);
    return <Observable<User>>this.http.post('/api/users/changepw-by-pw', body).pipe(shareReplay());
  }

  public authUpdateUser(user: User): Observable<User> {
    if (user.password) user.password = this.encryptPass(user.password);
    let body = user;
    return this.http.put<User>('/api/users/update', body);
  }

  public authGetUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users/list');
  }

  public authGetDownloads(): Observable<DlFile[]> {
    return this.http.get<DlFile[]>('/api/downloads/list');
  }

  public downloadFile(file: DlFile): Observable<Blob> {
    return this.http.get(file.fullPath, {responseType: 'blob'})
  }

  public deleteFile(file: DlFile): Observable<DlFile> {
    return this.http.delete<DlFile>('/api/downloads/' + file.filename)
  }

  public uploadFile(file: File): Observable<HttpEvent<any>> {
    // Note - this returns an EVENT, so we can track progress
    let formData = new FormData();
    formData.append('upload', file);
    const params = new HttpParams;
    const options = {params: params, reportProgress: true};
    const req = new HttpRequest('POST', '/api/downloads/upload', formData, options);
    return this.http.request(req);
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

  public lastLoggedInUserLevel(): number {
    return Number(localStorage.getItem('level'));
  }

  public authLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('level');
    localStorage.removeItem('expiresAt');
    this.user = new User;
  }

  private encryptPass(password) {
    return AES.encrypt(password, this.CFG.const.auth.password_secret).toString();
  }

  private storeLoginResponse(res) {
    localStorage.setItem('username', this.user.username);
    localStorage.setItem('jwtToken', res.jwtToken);
    localStorage.setItem('level', res.level);
    localStorage.setItem('expiresAt', res.expiresAt);
    localStorage.setItem('successfulLogin', 'true');
  }

}
