import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppConfig } from '../../app.config';
import { ManageComponent } from './manage.component';

// describe('User Module: ManageComponent', () => {
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: ManageUsersComponent;
//     let fixture: ComponentFixture<ManageUsersComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ManageUsersComponent],
//             imports: [ HttpClientModule, FormsModule, BrowserAnimationsModule, MatProgressSpinnerModule,
//                 MatInputModule, MatPaginatorModule, MatTableModule, RouterTestingModule, MatDialogModule],
//             providers: [
//                 { provide: AppConfig, useValue: configSpy }
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ManageUsersComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
