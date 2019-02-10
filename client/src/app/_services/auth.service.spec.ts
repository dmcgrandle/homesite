import { Injectable } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AES, enc as ENC } from 'crypto-ts';

import { AuthService } from './auth.service';
import { User } from '../_classes/user-classes';
import { DlFile } from '../_classes/fs-classes';
import { LoginResponse } from '../_classes/server-response-classes';
import { AppConfig } from '../app.config';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

// Mock classes
@Injectable()
export class MockAppConfig {
    const: Object = { auth: { password_secret: '1234' } };
}

@Injectable()
export class MockRSnapshot {
    url: string = 'testURL';
}

@Injectable()
export class MockRouter {
    navigate(url: string[]) {};
}

xdescribe('AuthService', () => {
    let auth: AuthService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService, 
                { provide: AppConfig, useClass: MockAppConfig },
                { provide: RouterStateSnapshot, useClass: MockRSnapshot },
                { provide: Router, useClass: MockRouter }
            ]
        });
        auth = TestBed.get(AuthService);
    });
    it('should be createable', () => expect(auth).toBeTruthy());

    describe('Users Methods', () => {
        let httpMock: HttpTestingController;
        beforeEach(() => {
            httpMock = TestBed.get(HttpTestingController); 
            auth.user = { _id: 1, name: 'A', username: 'B', password: 'C', email: 'D', level: 4 };
        });
        it('should successfully get list of users', async(() => {
            const testList: User[] = [
                { _id: 1, name: 'A', username: 'B', password: 'C', email: 'D', level: 4 },
                { _id: 2, name: 'E', username: 'F', password: 'G', email: 'H', level: 1 }
            ];
            auth.authGetUsers().subscribe(users => expect(users).toEqual(testList));
            let req = httpMock.expectOne('/api/users/list');
            expect(req.request.method).toEqual('GET');
            req.flush(testList);
            httpMock.verify();
        }));
        it('should encrypt the password when logging in', () => {
            auth.authLogin();
            expect(auth.user.password.length).toEqual(44);
            expect(AES.decrypt(auth.user.password.toString(),'1234').toString(ENC.Utf8)).toEqual('C');
        });
        it('should successfully log in a user', () => {
            const testRes: LoginResponse = {level: 4, jwtToken: 'A', expiresAt: 1234};
            auth.authLogin().subscribe(res => expect(res).toEqual(testRes));
            let req = httpMock.expectOne('/api/users/login');
            expect(req.request.method).toEqual('POST');
            req.flush(testRes);
        });
        it('should successfully register a new user', () => {
            auth.authRegister().subscribe(user => expect(user).toEqual(auth.user));
            let req = httpMock.expectOne('/api/users/create');
            expect(req.request.method).toEqual('POST');
            req.flush(auth.user);// send test user object back into the subscribe above.
        });
        it('should successfully post a forgot password request', async(() => {
            auth.authForgot().subscribe(user => expect(user).toEqual(auth.user));
            let req = httpMock.expectOne('/api/users/forgot');
            expect(req.request.method).toEqual('POST');
            req.flush(auth.user);
        }));
        it('should successfully change a password via emailed token', async(() => {
            auth.authChangePasswordByToken('token').subscribe(user => expect(user).toEqual(auth.user));
            let req = httpMock.expectOne('/api/users/changepw-by-token');
            expect(req.request.method).toEqual('POST');
            req.flush(auth.user);
        }));
        it('should successfully change a password by entering password', async(() => {
            auth.authChangePasswordByPassword('newPass').subscribe(user => expect(user).toEqual(auth.user));
            let req = httpMock.expectOne('/api/users/changepw-by-pw');
            expect(req.request.method).toEqual('POST');
            req.flush(auth.user);
        }));
        it('should successfully update a user', async(() => {
            auth.authUpdateUser(auth.user).subscribe(user => expect(user).toEqual(auth.user));
            let req = httpMock.expectOne('/api/users/update');
            expect(req.request.method).toEqual('PUT');
            req.flush(auth.user);
        }));
        afterEach(() => httpMock.verify());
    });

    describe('Downloads Methods', () => {
        let httpMock: HttpTestingController;
        let tFile: DlFile;
        beforeEach(() => {
            httpMock = TestBed.get(HttpTestingController); 
            tFile = { _id: 1, filename: 'A', fullPath: 'B', suffix: 'C', type: 'D', size: 4, sizeHR: 'E', icon: 'F' };
        });
        it('should successfully get a list of downloads', async(() => {
            const testList: DlFile[] = [ tFile, tFile ];
            auth.authGetDownloads().subscribe(files => expect(files).toEqual(testList));
            let req = httpMock.expectOne('/api/downloads/list');
            expect(req.request.method).toEqual('GET');
            req.flush(testList);
        }));
        it('should successfully download a file', async(() => {
            const testBlob: Blob = new Blob(['test blob content'], {type : 'text/plain'});
            auth.downloadFile(tFile).subscribe(blob => expect(blob.type).toEqual('text/plain'));
            let req = httpMock.expectOne(`${tFile.fullPath}`);
            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('blob');
            req.flush(testBlob);
        }));
        it('should successfully delete a file', async(() => {
            auth.deleteFile(tFile).subscribe(file => expect(file).toEqual(tFile));
            let req = httpMock.expectOne(`/api/downloads/${tFile.filename}`);
            expect(req.request.method).toEqual('DELETE');
            req.flush(tFile);
        }));
        it('should successfully upload a file', async(() => {
            const testFile: File = new File([],'A');
            const testEvent: HttpProgressEvent =  { type: HttpEventType.UploadProgress, loaded: 55 };
            auth.uploadFile(testFile).subscribe(res => expect(res.type).toBeDefined());
            let req = httpMock.expectOne('/api/downloads/upload');
            expect(req.request.method).toEqual('POST');
            req.flush(testEvent);
        }));
        afterEach(() => httpMock.verify());
    });

    describe('Storage methods', () => {
        beforeEach(() => {
            let store: Object = { // set some values for testing
                jwtToken: 'testToken',
                attemptedURL: 'http://test',
                username: 'testUser',
                level: '3',
                successfulLogin: 'false'
            };
            const mockLS = { // mock up the localStorage methods
                getItem: key => key in store ? store[key] : null,
                setItem: (key, val) => store[key] = val,
                removeItem: key => delete store[key],
                clear: () => store = {}
            };
            spyOn(localStorage, 'getItem').and.callFake(mockLS.getItem);
            spyOn(localStorage, 'setItem').and.callFake(mockLS.setItem);
            spyOn(localStorage, 'removeItem').and.callFake(mockLS.removeItem);
            spyOn(localStorage, 'clear').and.callFake(mockLS.clear);
        })
        it('should provide route guard services correctly', () => {
            let state = TestBed.get(RouterStateSnapshot);
            // set checks to one second either side of expiration
            const notExpired = Math.round(Date.now()/1000 + 301);
            const hasExpired = notExpired - 2;
            localStorage.setItem('expiresAt', notExpired.toString());
            expect(auth.canActivate(new ActivatedRouteSnapshot(), state)).toBeTruthy();
            expect(localStorage.getItem('attemptedURL')).toEqual('http://test');
            localStorage.setItem('expiresAt', hasExpired.toString());
            expect(auth.canActivate(new ActivatedRouteSnapshot(), state)).toBeFalsy();
            expect(localStorage.getItem('attemptedURL')).toEqual('testURL');
        })
    
        it('should retrieve jwtToken', () => {
            expect(auth.getToken()).toEqual('testToken');
        });
        it('should store url', () => {
            auth.setAttemptedURL('newTestURL');
            expect(localStorage.getItem('attemptedURL')).toEqual('newTestURL');
        });
        it('should retrieve url', () => {
            expect(auth.getAttemptedURL()).toEqual('http://test');
        });
        it('should clear url', () => {
            auth.clearAttemptedURL();
            expect(localStorage.getItem('attemptedURL')).toBeNull();
        });
        it('should tell if user has or has not logged in before', () => {
            expect(auth.hasLoggedInBefore()).toBeFalsy();
            localStorage.setItem('successfulLogin', 'true');
            expect(auth.hasLoggedInBefore()).toBeTruthy();
        });
        it('should retrieve last logged in username', () => {
            expect(auth.lastLoggedInUsername()).toEqual('testUser');
        });
        it('should retrieve last logged in user level', () => {
            expect(auth.lastLoggedInUserLevel()).toEqual(3);
        });
        it('should log out user by removing data', () => {
            auth.authLogout();
            expect(localStorage.getItem('username')).toBeNull();
            expect(localStorage.getItem('jwtToken')).toBeNull();
            expect(localStorage.getItem('level')).toBeNull();
            expect(localStorage.getItem('expiresAt')).toBeNull();
            expect(auth.user._id).toEqual(-1);
        });
        it('should evaluate if login has expired correctly', () => {
            // set checks to one second either side of expiration
            const notExpired = Math.round(Date.now()/1000 + 301);
            const hasExpired = notExpired - 2;
            localStorage.setItem('expiresAt', `${notExpired}`);
            expect(auth.isLoginExpired()).toBeFalsy();
            localStorage.setItem('expiresAt', `${hasExpired}`);
            expect(auth.isLoginExpired()).toBeTruthy();
        });
        it('should successfully store user credentials after logging in', async(() => {
            let httpMock = TestBed.get(HttpTestingController);
            const testRes: LoginResponse = {level: 4, jwtToken: 'T', expiresAt: 1234};
            auth.user = { _id: 1, name: 'A', username: 'B', password: 'C', email: 'D', level: 4 };
            auth.authLogin().subscribe(res => {
                    expect(res).toEqual(testRes)
                    expect(localStorage.getItem('username')).toEqual('B');
                    expect(localStorage.getItem('jwtToken')).toEqual('T');
                    expect(localStorage.getItem('level').toString()).toEqual('4');
                    expect(localStorage.getItem('expiresAt').toString()).toEqual('1234');
                    expect(localStorage.getItem('successfulLogin')).toEqual('true');
            });
            let loginReq = httpMock.expectOne('/api/users/login');
            expect(loginReq.request.method).toEqual('POST');
            loginReq.flush(testRes); // send back into the subscribe above.
            httpMock.verify();
        }));
    });
});
