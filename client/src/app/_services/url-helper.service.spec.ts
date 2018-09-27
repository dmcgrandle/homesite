import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UrlHelperService } from './url-helper.service';

describe('UrlHelperService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [UrlHelperService]
        });
    });

    it('should be created', inject([UrlHelperService], (service: UrlHelperService) => {
        expect(service).toBeTruthy();
    }));
});
