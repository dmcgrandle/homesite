import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MatDialogRef, MatDialogModule, MatToolbarModule, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AlertMessageDialogComponent, DialogData } from './alert-message-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

xdescribe('AlertMessageDialogComponent with data', () => {
    const mockDialogRef = jasmine.createSpyObj('mockDialogRef', ['close']);
    const mockDialogData: Partial<DialogData> = {
        heading: 'Testing',
        showCancel: true,
        cancelText: 'tCancel'
    };
    let component: AlertMessageDialogComponent;
    let fixture: ComponentFixture<AlertMessageDialogComponent>;
    let dialogElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlertMessageDialogComponent],
            providers: [
                { provide: MatDialogRef , useValue: mockDialogRef},
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
        dialogElement = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be creatable', () => {
        expect(component).toBeTruthy();
    });
    it('#onOkClick should close the dialog', () => {
        component.onOkClick();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });
    it('should display the correct title', () => {
        const title: string = dialogElement.querySelector('h3').textContent;
        expect(title).toContain('Testing');
    });
    it('should display the correct custom text inside the "Cancel" button', () => {
        const cancelEl: HTMLElement = dialogElement.querySelector('[mat-dialog-close]');
        expect(cancelEl).not.toBeNull('Cancel button is missing.');
        if (cancelEl) {
            expect(cancelEl.textContent).toContain('tCancel', 'Cancel button has wrong text');
        }
    });
});

xdescribe('AlertMessageDialogComponent without data', () => {
    const mockDialogRef = jasmine.createSpyObj('mockDialogRef', ['close']);
    const mockDialogData: Partial<DialogData> = {};
    let component: AlertMessageDialogComponent;
    let fixture: ComponentFixture<AlertMessageDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlertMessageDialogComponent],
            providers: [
                { provide: MatDialogRef , useValue: mockDialogRef},
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

    it('should be creatable', () => {
        expect(component).toBeTruthy();
    });
    it('should supply correct default data', () => {
        expect(component.data.heading).toEqual('Note');
        expect(component.data.okText).toEqual('Ok');
        expect(component.data.cancelText).toEqual('Cancel');
    });
});

