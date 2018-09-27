import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MatDialogModule, MatSelectModule,
         MatToolbarModule, MatIconModule, MAT_DIALOG_DATA, MatFormFieldModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';

//import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { AppConfig } from '../app.config';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({selector: 'app-auth', template: ''})
class AuthService {}

describe('EditUserDialogComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };
    const mockDialogData = {
        data: jasmine.createSpyObj({
            heading: 'Testing',
            alertMessage: 'This is test alertMessage',
            alertMessage2: 'This is test alertMessage2',
            showCancel: true,
            okText: 'tOk',
            cancelText: 'tCancel'
        })
    };
    const authSpy = jasmine.createSpyObj({
        user: {
            username: 'guest'
         }
    });
    const configSpy = jasmine.createSpyObj({
        const: {
            header: {
                title: 'tHeader'
            }
        }
    });
    let component: EditUserDialogComponent;
    let fixture: ComponentFixture<EditUserDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditUserDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: AuthService, useValue: authSpy },
                { provide: AppConfig, useValue: configSpy }
            ],
            imports: [HttpClientModule, FormsModule, MatIconModule, MatDialogModule, RouterTestingModule,
                MatToolbarModule, MatFormFieldModule, MatSelectModule]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [EditUserDialogComponent]
            }
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
//        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

/*
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MatDialogModule, MatToolbarModule, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AlertMessageDialogComponent } from './alert-message-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AlertMessageDialogComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };
    const mockDialogData = {
        data: jasmine.createSpyObj({
            heading: 'Testing',
            alertMessage: 'This is test alertMessage',
            alertMessage2: 'This is test alertMessage2',
            showCancel: true,
            okText: 'tOk',
            cancelText: 'tCancel'
        })
    }
    let component: AlertMessageDialogComponent;
    let fixture: ComponentFixture<AlertMessageDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlertMessageDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            imports: [HttpClientModule, MatDialogModule, MatToolbarModule]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [AlertMessageDialogComponent]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertMessageDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onOkClick should close the dialog', () => {
        component.onOkClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

});

*/