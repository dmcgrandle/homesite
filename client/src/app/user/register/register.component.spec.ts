import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatInputModule, MatToolbarModule, MatIconModule, MatDialogModule,
    MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppConfig } from '../../app.config';
import { RegisterComponent } from './register.component';

// describe('User Module: RegisterComponent', () => {
//     const mockDialogRef = {
//         close: jasmine.createSpy('close')
//     };
//     const mockDialogData = {
//         data: jasmine.createSpyObj({
//             heading: 'Testing',
//             alertMessage: 'This is test alertMessage',
//             alertMessage2: 'This is test alertMessage2',
//             showCancel: true,
//             okText: 'tOk',
//             cancelText: 'tCancel'
//         })
//     };
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: RegisterComponent;
//     let fixture: ComponentFixture<RegisterComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [RegisterComponent],
//             imports: [ FormsModule, MatFormFieldModule, MatToolbarModule, MatIconModule, HttpClientModule,
//                 RouterTestingModule, MatDialogModule, MatInputModule, BrowserAnimationsModule ],
//             providers: [
//                 { provide: MatDialogRef, useValue: mockDialogRef },
//                 { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
//                 { provide: AppConfig, useValue: configSpy }
//             ]
//         })
//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [RegisterComponent]
//             }
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(RegisterComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
