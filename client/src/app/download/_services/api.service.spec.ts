import { Injectable } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AES, enc as ENC } from 'crypto-ts';

import { APIService } from './api.service';
import { DlFile } from '../_helpers/classes';
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

xdescribe('AuthService', () => {
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

    describe('Downloads Methods', () => {
        let httpMock: HttpTestingController;
        let tFile: DlFile;
        beforeEach(() => {
            httpMock = TestBed.get(HttpTestingController); 
            tFile = { _id: 1, filename: 'A', fullPath: 'B', suffix: 'C', type: 'D', size: 4, sizeHR: 'E', icon: 'F' };
        });
        it('should successfully get a list of downloads', async(() => {
            const testList: DlFile[] = [ tFile, tFile ];
            api.authGetDownloads().subscribe(files => expect(files).toEqual(testList));
            let req = httpMock.expectOne('/api/downloads/list');
            expect(req.request.method).toEqual('GET');
            req.flush(testList);
        }));
        it('should successfully download a file', async(() => {
            const testBlob: Blob = new Blob(['test blob content'], {type : 'text/plain'});
            api.downloadFile(tFile).subscribe(blob => expect(blob.type).toEqual('text/plain'));
            let req = httpMock.expectOne(`${tFile.fullPath}`);
            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('blob');
            req.flush(testBlob);
        }));
        it('should successfully delete a file', async(() => {
            api.deleteFile(tFile).subscribe(file => expect(file).toEqual(tFile));
            let req = httpMock.expectOne(`/api/downloads/${tFile.filename}`);
            expect(req.request.method).toEqual('DELETE');
            req.flush(tFile);
        }));
        it('should successfully upload a file', async(() => {
            const testFile: File = new File([],'A');
            const testEvent: HttpProgressEvent =  { type: HttpEventType.UploadProgress, loaded: 55 };
            api.uploadFile(testFile).subscribe(res => expect(res.type).toBeDefined());
            let req = httpMock.expectOne('/api/downloads/upload');
            expect(req.request.method).toEqual('POST');
            req.flush(testEvent);
        }));
        afterEach(() => httpMock.verify());
    });

});
