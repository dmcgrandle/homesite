import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule, MatMenuModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AppConfig } from '../../app.config';
import { HeaderComponent } from './header.component';

// describe('Shared Module: HeaderComponent', () => {
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: HeaderComponent;
//     let fixture: ComponentFixture<HeaderComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [HeaderComponent],
//             imports: [ MatDividerModule, MatMenuModule, MatIconModule, MatToolbarModule, HttpClientModule, RouterTestingModule],
//             providers: [
//                 { provide: AppConfig, useValue: configSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(HeaderComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
