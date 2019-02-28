import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from '../../app.config';
import { HomeComponent } from './home.component';

@Component({selector: 'blank', template: ``}) 
class BlankComp {}

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s } }

xdescribe('Core Module: HomeComponent', () => {
    const configMock = {
        const: { 
            gallery: {
                featuredMedia: { filename: 'assets/tests/lion-sml.jpg' },
                featuredVideo: { filename: 'assets/tests/lion-sml.jpg' }
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
            declarations: [ HomeComponent, BlankComp, MockSecurePipe ],
            imports: [ MatCardModule, HttpClientModule, 
                RouterTestingModule.withRoutes([
                    { path: 'photo/albums', component: BlankComp },
                    { path: 'video/albums', component: BlankComp },
                ]) ],
            providers: [
                { provide: AppConfig, useValue: configMock }
            ]
        }).compileComponents();
        location = TestBed.get(Location);
        createComponent();
    }));

    it('should create', () => { expect(component).toBeTruthy() });

    it('should have a Photo Gallery title', () => {
        expect(page.photoTitle).toBeTruthy();
    });
    it('should have a Video Gallery title', () => {
        console.log(page.videoTitle);
        expect(page.videoTitle).toBeTruthy();
    });
    it('should navigate to photo albums if photoImage is clicked', fakeAsync(() => {
        page.photoImage.click();
        tick();
        expect(location.path()).toEqual('/photo/albums')
    }));
    it('should navigate to video albums if videoImage is clicked', fakeAsync(() => {
        page.videoImage.click();
        tick();
        expect(location.path()).toEqual('/video/albums')
    }));

});

class Page {
    get images()     { return this.queryAll<HTMLImageElement>('img'); }
    get photoImage() { return this.images[0]; }
    get videoImage() { return this.images[1]; }
    get photoTitle() { return this.queryText<HTMLElement>('photo gallery'); }
    get videoTitle() { return this.queryText<HTMLElement>('video gallery'); }

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
    private queryText<T>(search: string) : T {
        return (Array.from(this.fixture.nativeElement.querySelectorAll('*')) as T[])
            .filter(el => el['innerHTML'].toLowerCase() === search.toLowerCase())[0];
    }
}