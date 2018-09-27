import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatToolbarModule, MatIconModule, MatDialogModule } from '@angular/material';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig } from '../app.config';

import { ChangePasswordComponent } from './change-password.component';
//import { AuthService } from '../_services/auth.service';

@Component({selector: 'app-auth', template: ''})
class AuthService {}

describe('ChangePasswordComponent', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', {
        snapshot: {
            paramMap: {
                get() {
                    (t) => {
                        if (t === 'token') return 'ABCDEFGHIJKL';
                        if (t === 'username') return 'guest';
                    }
                }
            }
        }
    });
    const authSpy = jasmine.createSpyObj({
        user: {
            username: 'guest'
        }
    });
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangePasswordComponent],
            imports: [HttpClientModule, FormsModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatDialogModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeSpy },
                { provide: AuthService, useValue: authSpy },
                AppConfig
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
//        fixture.detectChanges();
// Why is the previous line commented out?  https://github.com/karma-runner/karma/issues/2852
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
