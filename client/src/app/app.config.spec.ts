import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';

import { IAppConfig } from './app.config.model';
import { AppConfig } from './app.config';

xdescribe('AppConfig', () => {
    let httpMock: HttpTestingController;
    let appConfig: AppConfig;
    const appCfgMock = {
        header: {
            title: "Homesite"
        },
        footer: {
            title: "www.example.com",
            email: "webmaster@example.com"
        }
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AppConfig]
        });
        httpMock = TestBed.get(HttpTestingController);
        appConfig = TestBed.get(AppConfig);
    });

    it('should be createable', () => {
        expect(appConfig).toBeTruthy();
    });
    it('should load the config file into the "const" property', async(() => {
        appConfig.load().then(() => {
            expect(appConfig.const).toEqual(<IAppConfig>appCfgMock);
        });
        let req = httpMock.expectOne(`assets/config/config.${environment.confName}.json`);
        expect(req.request.method).toEqual('GET');
        req.flush(appCfgMock);
    }));
    it('should not load the config file if error', async(() => {
        appConfig.load().then().catch((err) => {
            console.log(err);
            expect(err).toContain('Could not load file');
        });
        let req = httpMock.expectOne(`assets/config/config.${environment.confName}.json`);
        expect(req.request.method).toEqual('GET');
        req.error(new ErrorEvent(''));
    }));
});
