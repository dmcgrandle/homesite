
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatTabsModule, MatExpansionModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AboutComponent } from './about.component';
import { AppConfig } from '../app.config';

describe('AboutComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(async(() => {
        const configSpy = jasmine.createSpyObj('AppConfig', ['const']);
/*        const configSpy = jasmine.createSpyObj({
            const: {
                header: {
                    title: 'tHeader'
                }
            }
        }); */
        TestBed.configureTestingModule({
            declarations: [AboutComponent],
            providers: [{ provide: AppConfig, useValue: configSpy }],
            imports: [HttpClientTestingModule, MatCardModule, MatTabsModule, MatExpansionModule]
        });
//        httpClient = TestBed.get(HttpClient);
//        httpTestingController = TestBed.get(httpTestingController);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
//        cfg = TestBed.get(AppConfig);
//        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});
/*

import { AppConfig } from '../app.config';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    const configSpy = jasmine.createSpyObj({
        const: {
            header: {
                title: 'tHeader'
            }
        }
    });
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [ FormsModule, MatFormFieldModule, MatToolbarModule, MatIconModule, HttpClientModule, 
                RouterTestingModule, MatDialogModule, MatInputModule ],
            providers: [
                { provide: AppConfig, useValue: configSpy }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
//        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
*/
