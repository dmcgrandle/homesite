import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { UrlHelperService } from './url-helper.service';

xdescribe('UrlHelperService', () => {
    let httpMock: HttpTestingController;
    let urlHelper: UrlHelperService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UrlHelperService]
        });
        httpMock = TestBed.get(HttpTestingController);
        urlHelper = TestBed.get(UrlHelperService);
    });

    it('should be createable', () => {
        expect(urlHelper).toBeTruthy();
    });
    it('should return a blob from a given URL', async(() => {
            const testBlob: File = new File(['test blob content'], 'image.jpg', {type : 'text/plain'});
            const urlTest = '/test/path/to/image.jpg';
            const urlBlob = 'blob:http://localhost:1234/567890';
            spyOn(URL, 'createObjectURL').and.returnValue(urlBlob);
            spyOn(URL, 'revokeObjectURL');
            urlHelper.get(urlTest).subscribe(result => expect(result).toEqual(urlBlob));
            let req = httpMock.expectOne(urlTest);
            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('blob');
            req.flush(testBlob);
        }));
});
