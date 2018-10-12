import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatDialogModule, MatPaginatorModule, 
    MatIconModule, MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { DownloadsComponent } from './downloads.component';

@Component({selector: 'app-auth', template: ''})
class AuthService {}

// describe('DownloadsComponent', () => {
//     const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
//     const routeSpy = jasmine.createSpyObj('Route', {
//         snapshot: {
//             paramMap: {
//                 get() {
//                     (t) => {
//                         if (t === 'token') return 'ABCDEFGHIJKL';
//                         if (t === 'username') return 'guest';
//                     }
//                 }
//             }
//         }
//     });
//     const authSpy = jasmine.createSpyObj({
//         user: {
//             username: 'guest'
//          }
//     });
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: DownloadsComponent;
//     let fixture: ComponentFixture<DownloadsComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [DownloadsComponent],
//             imports: [ HttpClientModule, MatDialogModule, MatTableModule, MatPaginatorModule, RouterTestingModule,
//                 MatIconModule, MatFormFieldModule, MatProgressSpinnerModule],
//             providers: [
//                 { provide: Router, useValue: routerSpy },
//                 { provide: ActivatedRoute, useValue: routeSpy },
//                 { provide: AuthService, useValue: authSpy },
//                 { provide: AppConfig, useValue: configSpy }
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DownloadsComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
