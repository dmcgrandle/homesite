import { Injectable } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';
import { User } from '../_classes/user-classes';
import { AppConfig } from '../app.config';

@Injectable()
export class MockAppConfig {}

describe('AuthService', () => {
    let auth: AuthService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService, { provide: AppConfig, useClass: MockAppConfig }]
        });
        auth = TestBed.get(AuthService);
    });
    it('should be createable', () => expect(auth).toBeTruthy());

    describe('API methods', () => {
        let httpMock: HttpTestingController;
        beforeEach(() => {
            httpMock = TestBed.get(HttpTestingController);
        });
        it('should successfully get list of users with authGetUsers()', async(() => {
            const testList: User[] = [
                { _id: 0, name: 'A', username: 'uA', password: 'pA', email: 'eA', level: 4 },
                { _id: 0, name: 'B', username: 'uB', password: 'pB', email: 'eB', level: 1 }
            ];
            auth.authGetUsers().subscribe(users => expect(users).toEqual(testList));
            let usersReq = httpMock.expectOne('/api/users/list');
            usersReq.flush(testList);
        }));
    });

    describe('localStorage methods', () => {
        beforeEach(() => {
            let store: Object = { // set some values for testing
                jwtToken: 'testToken',
                attemptedURL: 'testURL'
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
        it('should return jwtToken from local storage', () => {
            expect(auth.getToken()).toEqual('testToken');
        });
        it('should store url into local storage', () => {
            auth.setAttemptedURL('newTestURL');
            expect(localStorage.getItem('attemptedURL')).toEqual('newTestURL');
        });
        it('should retrieve url from local storage', () => {
            expect(auth.getAttemptedURL()).toEqual('testURL');
        });
        it('should clear url from local storage', () => {
            auth.clearAttemptedURL();
            expect(localStorage.getItem('attemptedURL')).toBeNull();
        });

        /*

*/
    
    
    });
});
