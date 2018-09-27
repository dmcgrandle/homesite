import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatFormFieldModule, MatToolbarModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { ForgotDialogComponent } from './forgot-dialog.component';
import { AppConfig } from '../app.config';

describe('ForgotDialogComponent', () => {
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
    const configSpy = jasmine.createSpyObj({
        const: {
            header: {
                title: 'tHeader'
            }
        }
    });
    let component: ForgotDialogComponent;
    let fixture: ComponentFixture<ForgotDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ForgotDialogComponent],           
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: AppConfig, useValue: configSpy }
            ],
            imports: [HttpClientModule, MatDialogModule, MatFormFieldModule, MatToolbarModule, FormsModule, RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotDialogComponent);
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

    it('#onClosedeleteCustomer should close the dialog', () => {
        component.onOkClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

});
*/