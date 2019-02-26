import { async, fakeAsync, tick, flush, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MatFormFieldModule, MatDialogModule, MatPaginatorModule, MatInputModule, MatDialog,
    MatIconModule, MatTableModule, MatProgressSpinnerModule, MatSortModule } from '@angular/material';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { Observable, of, interval, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import * as fsaver from 'file-saver'; // import differently so we can spyOn methods more easily

import { DownloadsComponent } from './downloads.component';
import { FilenameComponent } from '../filename/filename.component';
import { DlFile, FilenameChangedObj } from '../_helpers/classes';
import { APIService } from '../_services/api.service';
import { map, elementAt } from 'rxjs/operators';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';

xdescribe('DownloadsComponent', () => {
    const testDlData: DlFile[] = 
        [ 
            {
                _id: 1,
                filename: 'tFilename1.pdf',
                fullPath: 'tFullPath1',
                suffix: 'tSuffix1',
                type: 'pdf',
                size: 1000,
                sizeHR: '1K',
                icon: 'tIcon1'
            },
            {
                _id: 2,
                filename: 'tFilename2.zip',
                fullPath: 'tFullPath2',
                suffix: 'tSuffix2',
                type: 'zip',
                size: 2000000,
                sizeHR: '2M',
                icon: 'tIcon2'
            },
        ];
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'createUrlTree']);
    const testBlob: Blob = new Blob(['test blob content'], {type : 'text/plain'});
    const mockAPI = jasmine.createSpyObj('APIService', {
        lastLoggedInUserLevel: 3,
        authGetDownloads: of(testDlData),
        downloadFile: of({type: new HttpResponse(), body: testBlob}),
        uploadFile: of({type: HttpEventType.UploadProgress, loaded: 1, total: 100}),
        renameFile: of(testDlData[0]),
        deleteFile: of(testDlData[0])
    });
    let mockFlex = jasmine.createSpyObj({isActive: true, asObservable: of({mqAlias: 'lg'})});
    const spyParamMap = jasmine.createSpyObj({get: null});
    const mockActivatedRoute = { paramMap: of(spyParamMap) };
    let dlComponent: DownloadsComponent;
    let page: Page;
    let fixture: ComponentFixture<DownloadsComponent>;
    let reloadSpy: jasmine.Spy;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(DownloadsComponent);
        dlComponent = fixture.componentInstance;
        page = new Page(fixture);
    
        // 1st change detection triggers ngOnInit
        fixture.detectChanges();
        return fixture.whenStable().then(() => {
        // 2nd change detection updates the display
            fixture.detectChanges();
        });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadsComponent, FilenameComponent],
            imports: [ MatDialogModule, MatTableModule, MatPaginatorModule, MatIconModule, 
                MatFormFieldModule, MatProgressSpinnerModule, MatSortModule, MatInputModule, 
                BrowserAnimationsModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: APIService, useValue: mockAPI },
                { provide: ObservableMedia, useValue: mockFlex }
            ]
        })
        .compileComponents();
    }));

    describe('Initialization', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(DownloadsComponent);
            dlComponent = fixture.componentInstance;
            reloadSpy = spyOn(dlComponent, 'reloadDownloads');
        });
    
        it('should be creatable', () => {
            expect(dlComponent).toBeTruthy();
        });
        it('ngOnInit Technique 1: should initialize with downloading a file if supplied', () => {
            // let route = TestBed.get(ActivatedRoute);
            // spyOn(route.snapshot.paramMap, 'get').and.returnValue('fFilename'); // as if invoked with a download param
            let onDl = spyOn(dlComponent, 'onDownloadClicked'); // don't let onDownloadClicked be invoked in this test
            spyParamMap.get.and.returnValue('tFilename');
            fixture.detectChanges();
            // expect(route.snapshot.paramMap.get).toHaveBeenCalled();
            expect(dlComponent.dataSource.data).toBeUndefined;
            expect(dlComponent.dlFilename).toEqual('tFilename');
            expect(onDl).toHaveBeenCalledTimes(1);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/download']); // re-call self, dropping the file name
            spyParamMap.get.and.returnValue(null); // set back to default
        });
        it('ngOnInit Technique 2: should initialize with default data', () => {
            reloadSpy.and.callThrough(); // TODO: test without dependency on another function ...
            fixture.detectChanges();
            expect(dlComponent.dataSource.data).toEqual(testDlData);
            expect(dlComponent.displayedColumns).toEqual(['fileId', 'downloadIcon', 'deleteIcon', 'linkIcon', 
                'filename', 'icon', 'type', 'sizeHR']);
            reloadSpy.calls.reset(); // set to default
            reloadSpy.and.stub(); 
        });
        it('ngOnInit Technique 2: displayedColumns should NOT contain deleteIcon if user level < 3', () => {
            mockAPI.lastLoggedInUserLevel.and.returnValue(2);
            fixture.detectChanges();
            expect(dlComponent.displayedColumns).toEqual(['fileId', 'downloadIcon', 'linkIcon', 'filename', 
                'icon', 'type', 'sizeHR']);
            mockAPI.lastLoggedInUserLevel.and.returnValue(3); // set back to default
            });
        it('ngOnInit Technique 2: displayedColumns should be minimal on xs screen width (< 600px)', () => {
            mockFlex.asObservable.and.returnValue(of({mqAlias: 'xs'}));
            fixture.detectChanges();
            expect(dlComponent.displayedColumns).toEqual(['downloadIcon', 'deleteIcon', 'linkIcon', 'filename']);
            mockFlex.asObservable.and.returnValue(of({mqAlias: 'lg'})); // set back for other tests.
        });
    });

    describe('Methods', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(DownloadsComponent);
            dlComponent = fixture.componentInstance;
            reloadSpy = spyOn(dlComponent, 'reloadDownloads');
        });

        it('applyFilter() should set the dataSource.filter properly', () => {
            dlComponent.applyFilter('\tGoofyFilterNOW    \n');
            expect(dlComponent.dataSource.filter).toEqual('goofyfilternow');
        });
        describe('onDownloadClicked()', () => {
            let dialogSpy: jasmine.Spy;
            const tFile: DlFile = new DlFile({ filename: 'tFile' });
            const dialogReturnObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
            beforeEach(() => {
                mockAPI.downloadFile.calls.reset(); // reset counters to eliminate test order dependency
                dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogReturnObj);
            });
            it('should display a progress dialog box and send a progress$ observable to that dialog', () => {
                dlComponent.onDownloadClicked(tFile);
                expect(dialogSpy).toHaveBeenCalledWith(ProgressBarComponent,
                    { data: jasmine.objectContaining({ progress$: jasmine.any(Observable) }) }
                );
                expect(mockAPI.downloadFile).toHaveBeenCalled();
            });
            it('should update progress$ observable properly with info from DownloadProgress events', fakeAsync(() => {
                mockAPI.uploadFile.and.returnValue(interval(100).pipe(take(10),map(i => {
                    return {type: HttpEventType.DownloadProgress, loaded: i+1, total: 100}
                }))); // mock of downloadFile will return an Observable of DownloadProgress slowly incrementing
                dialogSpy.and.callFake((comp, params) => { // set up an observer to react to progress$ changes
                    let prevValue: number = -1;
                    params.data.progress$.subscribe((percentDone) => {
                        expect(percentDone).toBe(prevValue + 1);
                        prevValue += 1;
                    });
                    return dialogReturnObj;
                });
                dlComponent.onDownloadClicked(tFile);
                tick(1000); // let all the intervals above resolve and settle
                expect(dialogSpy).toHaveBeenCalledTimes(1);
                expect(mockAPI.downloadFile).toHaveBeenCalledTimes(1);
                expect(reloadSpy).not.toHaveBeenCalled();
                expect(dialogReturnObj.close).not.toHaveBeenCalled();
            }));
            describe('properly finish the download when sent an HttpResponse event', () => {
                const testBlob: Blob = new Blob(['test blob content'], {type : 'text/plain'});
                const tRes = new HttpResponse({ body: testBlob });
                let spyConsole: jasmine.Spy;
                beforeEach(() => {
                    spyConsole = spyOn(console, 'log');
                    mockAPI.downloadFile.and.returnValue(of(tRes));
                    dlComponent.onDownloadClicked(tFile);
                })
                it('should log the downloaded file to the console', () => {
                    expect(spyConsole).toHaveBeenCalledWith('Downloaded file :', 'tFile');
                });
                it('should close the progress bar', () => {
                    expect(dialogReturnObj.close).toHaveBeenCalled();
                });
                it('should display an alert showing the download was successful', () => {
                    expect(dialogSpy).toHaveBeenCalledTimes(2);
                    expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
                    expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'successfully downloaded');
                });
            });
            describe('if a network error was encountered', () => {
                let spyConsole: jasmine.Spy;
                beforeEach(() => {
                    spyConsole = spyOn(console, 'log');
                    mockAPI.downloadFile.and.returnValue(throwError({message: 'network error'}));
                    dlComponent.onDownloadClicked(tFile);
                })
                it('should close the previous dialog', () => {
                    expect(dialogReturnObj.close).toHaveBeenCalled();
                });
                it('should log an error to the console', () => {
                    expect(spyConsole.calls.argsFor(0)).toContain('Download Error:', 'network error');
                });
                it('should display a new Alert Message dialog indicating the xfer was aborted', () => {
                    expect(dialogSpy).toHaveBeenCalledTimes(2);
                    expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
                    expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'Download Error!');
                });
            });
            describe('if STOP clicked before upload finishes', () => {
                const newR = jasmine.createSpyObj({ afterClosed : of({stopClicked: true}), close: null });
                const dlSubscribe = jasmine.createSpyObj({unsubscribe: null}); // prepare mock for subscribe
                beforeEach(() => {
                    dialogSpy.and.returnValue(newR); // change mocked response from dialog to have clicked "STOP"
                    mockAPI.downloadFile.and.returnValue({ subscribe: () => dlSubscribe}); // return our mock
                    dlComponent.onDownloadClicked(tFile);
                });
    
                it('should abort upload', () => {
                    expect(dlSubscribe.unsubscribe).toHaveBeenCalled(); // ensure download was unsubscribed (aborted)
                });
                it('should display a new Alert Message dialog indicating the xfer was aborted', () => {
                    expect(dialogSpy).toHaveBeenCalledTimes(2);
                    expect(dialogSpy.calls.argsFor(0)).toContain(ProgressBarComponent); // 1st call
                    expect(dialogSpy.calls.argsFor(1)).toContain(AlertMessageDialogComponent, 'Download was aborted.');
                });
            });
        });
        it('onFilenameChange()) should send new FilenameChangedObj to api service and confirm with an alert message dialog', () => {
            const tFilenameChanged: FilenameChangedObj = {_id: 0, oldFilename: 'oFile', newFilename: 'tFilename1.pdf'};
            const dialogSpy = spyOn(TestBed.get(MatDialog), 'open');
            mockAPI.renameFile.calls.reset();
            dlComponent.onFilenameChange(tFilenameChanged);
            expect(dialogSpy).toHaveBeenCalledWith(
                AlertMessageDialogComponent, 
                { data: jasmine.objectContaining({heading: 'Rename Successful' })}
            );
        });

        it('onLinkClicked() should copy data to the clipboard', () => {
            routerSpy.createUrlTree.and.returnValue(12345); // Number has .toString() method
            const dialogSpy = spyOn(TestBed.get(MatDialog), 'open');
            let execSpy = spyOn(document, 'execCommand').and.callThrough();
            fixture.detectChanges();
            dlComponent.onLinkClicked(testDlData[0]); 
            expect(routerSpy.createUrlTree).toHaveBeenCalled();
            expect(execSpy).toHaveBeenCalled();
            expect(dialogSpy).toHaveBeenCalled();
        });
        describe('onDeleteClicked()', () => {
            let dialogSpy: jasmine.Spy;
            beforeEach(() => {
                dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and
                    .returnValue({ afterClosed : () => of({}) }); // Cancel clicked
            });
            it('should first display a confirmation dialog box', () => {
                dlComponent.onDeleteClicked(testDlData[0])
                expect(dialogSpy).toHaveBeenCalled();

            });
            it('should not call auth.deleteFile() or reloadDownloads() if user clicks cancel', () => {
                reloadSpy.calls.reset(); // clear calls so we can test it
                dlComponent.onDeleteClicked(testDlData[0])
                expect(dialogSpy).toHaveBeenCalled();
                expect(mockAPI.deleteFile).not.toHaveBeenCalled();
                expect(reloadSpy).not.toHaveBeenCalled();
            });
            it('should call auth.deleteFile() and reloadDownloads() if user confirms', () => {
                reloadSpy.calls.reset();
                dialogSpy.and.returnValue({ afterClosed : () => of({okClicked: true}) });
                let spyConsole = spyOn(console, 'log');
                dlComponent.onDeleteClicked(testDlData[0]);
                expect(dialogSpy).toHaveBeenCalled();
                expect(mockAPI.deleteFile).toHaveBeenCalledWith(testDlData[0]);
                expect(spyConsole).toHaveBeenCalledWith('Deleted file tFilename1.pdf');
                expect(reloadSpy).toHaveBeenCalled();
            });
        });
        describe('uploadPickedFile()', () => {
            let dialogSpy: jasmine.Spy;
            const eventMock = { target: { files: ['tFile'] } };
            const dialogReturnObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
            beforeEach(() => {
                dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogReturnObj);
            });
            afterEach(() => {
                mockAPI.uploadFile.calls.reset(); // reset counters to eliminate test order dependency
            })
            it('should display a progress dialog box and send a progress$ observable to that dialog', () => {
                dlComponent.uploadPickedFile(eventMock);
                expect(dialogSpy).toHaveBeenCalledWith(ProgressBarComponent,
                    { data: jasmine.objectContaining({ progress$: jasmine.any(Observable) }) });
                expect(mockAPI.uploadFile).toHaveBeenCalledTimes(1); // This is the first spec it is called in ...
                });
            it('should update progress$ observable properly with info from UploadProgress events', fakeAsync(() => {
                mockAPI.uploadFile.and.returnValue(interval(100).pipe(take(10),map(i => {
                    return {type: HttpEventType.UploadProgress, loaded: i+1, total: 100}
                }))); // mock of uploadFile will return an Observable of UploadProgress slowly incrementing
                dialogSpy.and.callFake((comp, params) => { // set up an observer to react to progress$ changes
                    let prevValue: number = -1;
                    params.data.progress$.subscribe((percentDone) => {
                        expect(percentDone).toBe(prevValue + 1);
                        prevValue += 1;
                    });
                    return dialogReturnObj;
                });
                dlComponent.uploadPickedFile(eventMock);
                tick(1000); // let all the intervals above resolve and settle
                expect(dialogSpy).toHaveBeenCalledTimes(1);
                expect(mockAPI.uploadFile).toHaveBeenCalledTimes(1);
                expect(reloadSpy).not.toHaveBeenCalled();
                expect(dialogReturnObj.close).not.toHaveBeenCalled();
            }));
            describe('properly finish the upload when sent an HttpResponse event', () => {
                const tRes = new HttpResponse({ body: { filename: 'tFile' } });
                let spyConsole: jasmine.Spy;
                beforeEach(() => {
                    spyConsole = spyOn(console, 'log');
                    mockAPI.uploadFile.and.returnValue(of(tRes));
                    dlComponent.uploadPickedFile(eventMock);
                })
                it('should log the uploaded file to console', () => {
                    expect(spyConsole).toHaveBeenCalledWith('Uploaded file :', 'tFile');
                });
                it('shoule reload downloads', () => {
                    expect(reloadSpy).toHaveBeenCalled();
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
                    mockAPI.uploadFile.and.returnValue(throwError({message: 'network error'}));
                    dlComponent.uploadPickedFile(eventMock);
                })
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
                const newR = jasmine.createSpyObj({ afterClosed : of({stopClicked: true}), close: null });
                const uploadSubscribe = jasmine.createSpyObj({unsubscribe: null}); // prepare mock for subscribe
                beforeEach(() => {
                    dialogSpy.and.returnValue(newR); // change mocked response from dialog to have clicked "STOP"
                    mockAPI.uploadFile.and.returnValue({ subscribe: () => uploadSubscribe}); // return our mock
                    dlComponent.uploadPickedFile(eventMock);
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
        describe('reloadDownloads() ', () => {
            beforeEach(() => {
                reloadSpy.and.callThrough(); // allow the function to execute
            });
            it('should update the loading$ observable from false to true then back to false', () => {
                const expectedVals = [false, true, false];
                let index = 0;
                fixture.detectChanges();
                dlComponent.loading$.subscribe(
                    val => expect(val).toEqual(expectedVals[index++])
                );
                dlComponent.reloadDownloads();
            });
            it('should call authGetDownloads() to refresh with new data', () => {
                mockAPI.authGetDownloads.calls.reset();
                dlComponent.reloadDownloads();
                expect(mockAPI.authGetDownloads).toHaveBeenCalled();
                expect(dlComponent.dataSource.data).toEqual(testDlData);
            }); 
        });
    });
    describe('HTML Template', () => {
        // let buttons: NodeListOf<HTMLButtonElement>;
        beforeEach(async(() => {
            createComponent();
        }));
        it('should display a spinner if loading$ is true', () => {
            dlComponent.loading$.next(true);
            fixture.detectChanges();
            expect(page.spinner).not.toBeNull();
        });
        it('should not display a spinner if loading$ is false', () => {
            dlComponent.loading$.next(false);
            fixture.detectChanges();
            expect(page.spinner).toBeNull();
        });
        it('download-container div should be hidden if loading$ is true', () => {
            dlComponent.loading$.next(true);
            fixture.detectChanges();
            expect(page.dlContainer.getAttribute('hidden')).not.toBeNull();
        });
        it('download-container div should not be hidden if loading$ is false', () => {
            dlComponent.loading$.next(false);
            fixture.detectChanges();
            expect(page.dlContainer.getAttribute('hidden')).toBeNull();
        });
        it('should have a visible filter input', () => {
            expect(page.filterInput).toBeTruthy();
            expect(page.filterInput.getAttribute('hidden')).toBeNull();
        });
        it('should have an invisible upload input of type "file" for selecting the upload', () => {
            expect(page.uploadInput).toBeTruthy();
            expect(page.uploadInput.type).toEqual('file');
            expect(page.uploadInput.getAttribute('hidden')).not.toBeNull();
        });
        it('should have an upload icon', () => {
            expect(page.uploadIcon).toBeTruthy();
        });
        it('should select a file (click uploadInput) if upload icon is clicked', () => {
            const fSpy = spyOn(page.uploadInput, 'click');
            page.uploadIcon.click();
            expect(fSpy).toHaveBeenCalled();
        });
        it('should display a table of downloads', () => {
            expect(page.table).toBeTruthy();
        });
        it('should display two test downloads', () => {
            expect(page.tableRows.length).toEqual(2);
        });
        it('should display fileId column properly', () => {
            expect(page.fileIds[0].textContent).toEqual('ID'); // 0 is column title
            expect(page.fileIds[1].textContent).toEqual(' 1 '); // 1 is first download
            expect(page.fileIds[2].textContent).toEqual(' 2 ');
        });
        it('should display filename column properly', () => {
            expect(page.filenames[0].textContent).toEqual(' Filename '); // 0 is column title
            expect(page.filenames[1].querySelector('input').value).toEqual('tFilename1.pdf'); // inside a nested input element
            expect(page.filenames[2].querySelector('input').value).toEqual('tFilename2.zip');
            console.log('page.filenames[1] is:', page.filenames[1]);
        });
        it('should display fileType column properly', () => {
            expect(page.fileTypes[0].textContent).toEqual(' Type ');
            expect(page.fileTypes[1].textContent).toEqual(' pdf ');
            expect(page.fileTypes[2].textContent).toEqual(' zip ');
        });
        it('should display fileSize column properly', () => {
            expect(page.fileSizes[0].textContent).toEqual(' Size ');
            expect(page.fileSizes[1].textContent).toEqual(' 1K ');
            expect(page.fileSizes[2].textContent).toEqual(' 2M ');
        });
        it('should display the right number of download, delete and link icons', () => {
            expect(page.downloadIcons.length).toBe(3); // 3 because it includes column title
            expect(page.deleteIcons.length).toBe(3);
            expect(page.linkIcons.length).toBe(3);
        });
    });
});

class Page {
    get spinner()       { return this.query<HTMLElement>('.spinner'); }
    get dlContainer()   { return this.query<HTMLDivElement>('.download-container'); }
    get inputs()        { return this.queryAll<HTMLInputElement>('input'); }
    get filterInput()   { return this.inputs[0]; }
    get uploadInput()   { return this.inputs[1]; }
    get uploadIcon()    { return this.query<HTMLElement>('.upload-icon'); }
    get table()         { return this.query<HTMLTableElement>('table'); }
    get tableRows()     { return this.queryAll<HTMLTableRowElement>('tr.mat-row'); }
    get downloadIcons() { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-downloadIcon') }
    get deleteIcons()   { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-deleteIcon') }
    get linkIcons()     { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-linkIcon') }
    get fileIds()       { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-fileId') }
    get filenames()     { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-filename') }
    get fileTypeIcons() { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-icon') }
    get fileTypes()     { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-type') }
    get fileSizes()     { return this.queryAll<HTMLTableDataCellElement>('.cdk-column-sizeHR') }

    private fixture: ComponentFixture<DownloadsComponent>;
  
    constructor(fixture: ComponentFixture<DownloadsComponent>) {
        this.fixture = fixture;
    }
  
    //// query helpers ////
    private query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }
  
    private queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }
}