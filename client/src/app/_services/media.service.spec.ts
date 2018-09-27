import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { MediaService } from './media.service';
import { AppConfig } from '../app.config';


describe('MediaService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [MediaService, AppConfig]
        });
    });

    it('should be created', inject([MediaService], (service: MediaService) => {
        expect(service).toBeTruthy();
    }));
});
