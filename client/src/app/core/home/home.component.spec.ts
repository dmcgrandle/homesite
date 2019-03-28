import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from '../../app.config';
import { HomeComponent } from './home.component';

class Page {
    get backImg() { return this.query<HTMLImageElement>('.BackImage'); }
    get banner() { return this.queryText<HTMLElement>('Welcome to our home'); }
    get allIcons() { return this.queryAll<HTMLElement>('.icon'); }
    get allDescs() { return this.queryAll<HTMLElement>('.icon-description'); }
    get photoIcon() { return this.allIcons[0]; } // photo should be first
    get videoIcon() { return this.allIcons[1]; }
    get downloadIcon() { return this.allIcons[2]; }
    get familyIcon() { return this.allIcons[3]; }
    get photoDesc() { return this.queryText<HTMLElement>('Photos'); }
    get videoDesc() { return this.queryText<HTMLElement>('Videos'); }
    get downloadDesc() { return this.queryText<HTMLElement>('Downloads'); }
    get familyDesc() { return this.queryText<HTMLElement>('Family'); }

    private fixture: ComponentFixture<HomeComponent>;

    constructor(fixture: ComponentFixture<HomeComponent>) {
        this.fixture = fixture;
    }

    /* query helpers */
    private query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }
    private queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }
    private queryText<T>(search: string): T {
        return (Array.from(this.fixture.nativeElement.querySelectorAll('*')) as T[])
            .filter(el => el['innerHTML'].toLowerCase() === search.toLowerCase())[0];
    }
}

@Component({ selector: 'test-blank', template: `` })
class BlankComponent { }

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s; } }

describe('Core Module: HomeComponent', () => {
    const configMock = {
        const: {
            home: {
                background: 'assets/tests/lion-sml.jpg'
            }
        }
    };
    let location: Location;
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let page: Page;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        return fixture.whenStable().then(() => fixture.detectChanges());
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent, BlankComponent, MockSecurePipe],
            imports: [MatIconModule, HttpClientModule,
                RouterTestingModule.withRoutes([
                    { path: 'photo/albums', component: BlankComponent },
                    { path: 'video/albums', component: BlankComponent },
                    { path: 'download', component: BlankComponent },
                    { path: 'family', component: BlankComponent },
                ])],
            providers: [
                { provide: AppConfig, useValue: configMock }
            ]
        }).compileComponents();
        location = TestBed.get(Location);
        createComponent();
    }));

    it('should create', () => { expect(component).toBeTruthy(); });

    it('should have a background image', () => {
        expect(page.backImg).toBeDefined();
    });
    it('should have a Welcome banner', () => {
        expect(page.banner).toBeDefined();
    });
    it('should properly label all the icons', () => {
        expect(page.photoDesc).toBeDefined();
        expect(page.videoDesc).toBeDefined();
        expect(page.downloadDesc).toBeDefined();
        expect(page.familyDesc).toBeDefined();
    });
    it('should navigate to /media/photo/albums if the photo icon is clicked', fakeAsync(() => {
        page.photoIcon.click();
        tick();
        expect(location.path()).toEqual('/media/photo/albums');
    }));
    it('should navigate to /media/video/albums if the video icon is clicked', fakeAsync(() => {
        page.videoIcon.click();
        tick();
        expect(location.path()).toEqual('/media/video/albums');
    }));
    it('should navigate to /download if the downloads icon is clicked', fakeAsync(() => {
        page.downloadIcon.click();
        tick();
        expect(location.path()).toEqual('/download');
    }));
    it('should navigate to /family if the family icon is clicked', fakeAsync(() => {
        page.familyIcon.click();
        tick();
        expect(location.path()).toEqual('/family');
    }));

});
