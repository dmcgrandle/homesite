import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatToolbarModule, MatProgressBarModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { DownloadProgressBarComponent } from './download-progress-bar.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

xdescribe('DownloadProgressBarComponent', () => {
    const mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);
    const mockDialogData = {
        heading: 'tHeading',
        stopText: 'tStop',
        progress$: new BehaviorSubject<number>(0)
    };
    let dlProgressBarComp: DownloadProgressBarComponent;
    let dlProgressBarEl: HTMLElement;
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
        dlProgressBarComp = fixture.componentInstance;
        dlProgressBarEl = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be creatable', () => {
        expect(dlProgressBarComp).toBeTruthy();
    });
    it('#onStopClick should close the dialog', () => {
        dlProgressBarComp.onStopClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
    it('should display heading and stopText sent to it', () => {
        const heading = dlProgressBarEl.querySelector('h3').textContent;
        const button = dlProgressBarEl.querySelector('button').textContent;
        expect(heading).toEqual('tHeading');
        expect(button).toEqual('tStop');
    });
    it('should display defaults if not passed anything', () => {
        dlProgressBarComp.data.heading = null;
        dlProgressBarComp.data.stopText = null;
        dlProgressBarComp.ngOnInit();
        fixture.detectChanges(); // Update UI
        const heading = dlProgressBarEl.querySelector('h3').textContent;
        const button = dlProgressBarEl.querySelector('button').textContent;
        expect(heading).toEqual('Upload');
        expect(button).toEqual('STOP');
    });
    it('should update the UI as progress changes', () => {
        for (let i=50;i<60;i++) {
            mockDialogData.progress$.next(i);
            fixture.detectChanges();
            const progressIndicator = dlProgressBarEl.querySelector('p').textContent;
            expect(progressIndicator).toBe(`${i}%`);
        };
    });


});
