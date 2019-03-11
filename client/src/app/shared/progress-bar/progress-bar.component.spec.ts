import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatToolbarModule, MatProgressBarModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { ProgressBarComponent } from './progress-bar.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('Shared Module: ProgressBarComponent', () => {
    const mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);
    const mockDialogData = {
        heading: 'tHeading',
        stopText: 'tStop',
        progress$: new BehaviorSubject<number>(0)
    };
    let progressBarComp: ProgressBarComponent;
    let progressBarEl: HTMLElement;
    let fixture: ComponentFixture<ProgressBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProgressBarComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            imports: [MatDialogModule, MatToolbarModule, MatProgressBarModule]
        })
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [ProgressBarComponent]
            }
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressBarComponent);
        progressBarComp = fixture.componentInstance;
        progressBarEl = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be creatable', () => {
        expect(progressBarComp).toBeTruthy();
    });
    it('#onStopClick should close the dialog', () => {
        progressBarComp.onStopClick();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
    it('should display heading and stopText sent to it', () => {
        const heading = progressBarEl.querySelector('h3').textContent;
        const button = progressBarEl.querySelector('button').textContent;
        expect(heading).toEqual('tHeading');
        expect(button).toEqual('tStop');
    });
    it('should display defaults if not passed anything', () => {
        progressBarComp.data.heading = null;
        progressBarComp.data.stopText = null;
        progressBarComp.ngOnInit();
        fixture.detectChanges(); // Update UI
        const heading = progressBarEl.querySelector('h3').textContent;
        const button = progressBarEl.querySelector('button').textContent;
        expect(heading).toEqual('Upload');
        expect(button).toEqual('STOP');
    });
    it('should update the UI as progress changes', () => {
        for (let i=50;i<60;i++) {
            mockDialogData.progress$.next(i);
            fixture.detectChanges();
            const progressIndicator = progressBarEl.querySelector('p').textContent;
            expect(progressIndicator).toBe(`${i}%`);
        };
    });


});
