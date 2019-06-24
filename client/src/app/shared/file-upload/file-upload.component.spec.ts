import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, interval, throwError } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialogModule, MatDialog } from '@angular/material';

import { FileUploadComponent } from './file-upload.component';
import { ProgressBarComponent } from 'shared/progress-bar/progress-bar.component';
import { AlertMessageDialogComponent } from 'shared/alert-message-dialog/alert-message-dialog.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  const mockAPI = jasmine.createSpyObj('APIService', {
    lastLoggedInUserLevel: 3,
    uploadFile: of({ type: HttpEventType.UploadProgress, loaded: 1, total: 100 }),
});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadComponent ],
      imports: [MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

/* NOTE: UNTESTED!  Copied over from downloadcomponent - needs testing!! */

  describe('uploadPickedFile()', () => {
    let dialogSpy: jasmine.Spy;
    const eventMock = { target: { files: ['tFile'] } };
    const dialogReturnObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    beforeEach(() => {
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogReturnObj);
    });
    afterEach(() => {
        mockAPI.uploadFile.calls.reset(); // reset counters to eliminate test order dependency
    });
    it('should display a progress dialog box and send a progress$ observable to that dialog', () => {
        component.uploadPickedFile(eventMock);
        expect(dialogSpy).toHaveBeenCalledWith(ProgressBarComponent,
            { data: jasmine.objectContaining({ progress$: jasmine.any(Observable) }) });
        expect(mockAPI.uploadFile).toHaveBeenCalledTimes(1); // This is the first spec it is called in ...
    });
    it('should update progress$ observable properly with info from UploadProgress events', fakeAsync(() => {
        mockAPI.uploadFile.and.returnValue(interval(100).pipe(take(10), map(i => {
            return { type: HttpEventType.UploadProgress, loaded: i + 1, total: 100 };
        }))); // mock of uploadFile will return an Observable of UploadProgress slowly incrementing
        dialogSpy.and.callFake((comp, params) => { // set up an observer to react to progress$ changes
            let prevValue = -1;
            params.data.progress$.subscribe((percentDone) => {
                expect(percentDone).toBe(prevValue + 1);
                prevValue += 1;
            });
            return dialogReturnObj;
        });
        component.uploadPickedFile(eventMock);
        tick(1000); // let all the intervals above resolve and settle
        expect(dialogSpy).toHaveBeenCalledTimes(1);
        expect(mockAPI.uploadFile).toHaveBeenCalledTimes(1);
        expect(dialogReturnObj.close).not.toHaveBeenCalled();
    }));
    describe('properly finish the upload when sent an HttpResponse event', () => {
        const tRes = new HttpResponse({ body: { filename: 'tFile' } });
        let spyConsole: jasmine.Spy;
        beforeEach(() => {
            spyConsole = spyOn(console, 'log');
            mockAPI.uploadFile.and.returnValue(of(tRes));
            component.uploadPickedFile(eventMock);
        });
        it('should log the uploaded file to console', () => {
            expect(spyConsole).toHaveBeenCalledWith('Uploaded file :', 'tFile');
        });
        it('should close the progress bar', () => {
            expect(dialogReturnObj.close).toHaveBeenCalled();
        });
        it('should display an alert showing the upload was successful', () => {
            expect(dialogSpy).toHaveBeenCalledTimes(2);
            expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
            expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'successfully uploaded');
        });
    });
    describe('if a network error was encountered', () => {
        let spyConsole: jasmine.Spy;
        beforeEach(() => {
            spyConsole = spyOn(console, 'log');
            mockAPI.uploadFile.and.returnValue(throwError({ message: 'network error' }));
            component.uploadPickedFile(eventMock);
        });
        it('should close the previous dialog', () => {
            expect(dialogReturnObj.close).toHaveBeenCalled();
        });
        it('should log an error to the console', () => {
            expect(spyConsole.calls.argsFor(0)).toContain('Upload Error:', 'network error');
        });
        it('should display a new Alert Message dialog indicating the xfer was aborted', () => {
            expect(dialogSpy).toHaveBeenCalledTimes(2);
            expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
            expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'Upload Error!');
        });
    });
    describe('if STOP clicked before upload finishes', () => {
        const newR = jasmine.createSpyObj({ afterClosed: of({ stopClicked: true }), close: null });
        const uploadSubscribe = jasmine.createSpyObj({ unsubscribe: null }); // prepare mock for subscribe
        beforeEach(() => {
            dialogSpy.and.returnValue(newR); // change mocked response from dialog to have clicked "STOP"
            mockAPI.uploadFile.and.returnValue({ subscribe: () => uploadSubscribe }); // return our mock
            component.uploadPickedFile(eventMock);
        });

        it('should abort upload', () => {
            expect(uploadSubscribe.unsubscribe).toHaveBeenCalled(); // ensure upload unsubscribed (aborted)
        });
        it('should display a new Alert Message dialog indicating the xfer was aborted', () => {
            expect(dialogSpy).toHaveBeenCalledTimes(2);
            expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
            expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'Transfer was aborted.');
        });
    });
  });

});
