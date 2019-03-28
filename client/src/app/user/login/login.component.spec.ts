import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatInputModule, MatToolbarModule, MatIconModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { AppConfig } from '../../app.config';
import { LoginComponent } from './login.component';

// describe('User Module: LoginComponent', () => {
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: LoginComponent;
//     let fixture: ComponentFixture<LoginComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [LoginComponent],
//             imports: [ FormsModule, MatFormFieldModule, MatToolbarModule, MatIconModule, HttpClientModule,
//                 RouterTestingModule, MatDialogModule, MatInputModule ],
//             providers: [
//                 { provide: AppConfig, useValue: configSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(LoginComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
