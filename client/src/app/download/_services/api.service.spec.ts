import { Injectable } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpClient, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { APIService } from './api.service';
import { DlFile, FilenameChangedObj} from '../_helpers/classes';
import { AppConfig } from '../../app.config';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

// Mock classes
@Injectable()
export class MockAppConfig {
    const: Object = { auth: { password_secret: '1234' } };
}

@Injectable()
export class MockRSnapshot {
    url: string = 'testURL';
}

@Injectable()
export class MockRouter {
    navigate(url: string[]) {};
}

describe('Download Module: APIService', () => {
    let api: APIService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                APIService, 
                { provide: AppConfig, useClass: MockAppConfig },
                { provide: RouterStateSnapshot, useClass: MockRSnapshot },
                { provide: Router, useClass: MockRouter }
            ]
        });
        api = TestBed.get(APIService);
    });
    it('should be createable', () => expect(api).toBeTruthy());

    describe('Methods', () => {
        let httpMock: HttpTestingController;
        let tFile: DlFile;
        beforeEach(() => {
            httpMock = TestBed.get(HttpTestingController); 
            tFile = { _id: 1, filename: 'A', fullPath: 'B', suffix: 'C', type: 'D', size: 4, sizeHR: 'E', icon: 'F' };
        });
        it('should successfully get a list of downloads', () => {
            const testList: DlFile[] = [ tFile, tFile ];
            api.authGetDownloads().subscribe(files => expect(files).toEqual(testList));
            let req = httpMock.expectOne('/api/downloads/list');
            expect(req.request.method).toEqual('GET');
            req.flush(testList);
        });
        it('should successfully initiate the download of a file', () => {
            // const testBlob: Blob = new Blob(['test blob content'], {type : 'text/plain'});
            const testEvent: HttpProgressEvent =  { type: HttpEventType.DownloadProgress, loaded: 18 };
            let http = TestBed.get(HttpClient);
            spyOn(http, 'request').and.returnValue(of(testEvent));
            api.downloadFile(tFile).subscribe(() => {
                expect(http.request).toHaveBeenCalledWith(jasmine.objectContaining({responseType: 'blob'}));
            });
            http.request.and.callThrough();
        });
        it('should successfully send a DELETE request to the backend for the given file', () => {
            api.deleteFile(tFile).subscribe(file => expect(file).toEqual(tFile));
            let req = httpMock.expectOne(`/api/downloads/${tFile.filename}`);
            expect(req.request.method).toEqual('DELETE');
            req.flush(tFile);
        });
        it('should successfully send a POST request to the backend with body === given FilenameChangedObj', () => {
            const tFilenameChanged: FilenameChangedObj = {_id: 0, oldFilename: 'oFile', newFilename: 'nFile'};
            api.renameFile(tFilenameChanged).subscribe(() => {
                expect(req.request.body).toEqual(tFilenameChanged);
            });
            let req = httpMock.expectOne(`/api/downloads/rename`);
            expect(req.request.method).toEqual('POST');
            req.flush(tFile);
        });
        it('should successfully upload a file', () => {
            const testFile: File = new File([],'A');
            const testEvent: HttpProgressEvent =  { type: HttpEventType.UploadProgress, loaded: 55 };
            api.uploadFile(testFile).subscribe(res => expect(res.type).toBeDefined());
            let req = httpMock.expectOne('/api/downloads/upload');
            expect(req.request.method).toEqual('POST');
            req.flush(testEvent);
        });
        afterEach(() => httpMock.verify());
    });

});
