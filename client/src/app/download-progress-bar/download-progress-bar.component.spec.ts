import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatToolbarModule, MatProgressBarModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
// import { MatDialogRef, MatDialog, MatDialogModule, MatToolbarModule, MAT_DIALOG_DATA } from '@angular/material';

import { DownloadProgressBarComponent } from './download-progress-bar.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('DownloadProgressBarComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };
    const mockDialogData = {
        data: jasmine.createSpyObj({
            heading: 'tHeading',
            stopText: 'tStop',
            progress$: new BehaviorSubject<number>(0)
        })
    }
    let component: DownloadProgressBarComponent;
    let fixture: ComponentFixture<DownloadProgressBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadProgressBarComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            imports: [MatDialogModule, MatToolbarModule, MatProgressBarModule]    
        })
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DownloadProgressBarComponent]
            }
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onStopClick should close the dialog', () => {
        component.onStopClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

});
