import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { GalleryComponent } from './gallery.component';

@Component({selector: 'blank', template: ``}) 
class BlankComp {}

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s } }

xdescribe('GalleryComponent', () => {
    const configMock = { 
        const: { 
            gallery: {
                featuredMedia: { filename: 'assets/tests/lion-sml.jpg' },
                featuredVideo: { filename: 'assets/tests/lion-sml.jpg' }
            }
        }
    };
    let location: Location;
    let router: Router;
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let page: Page;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        return fixture.whenStable().then(() => fixture.detectChanges());
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GalleryComponent, BlankComp, MockSecurePipe ],
            imports: [ MatCardModule, HttpClientModule, 
                RouterTestingModule.withRoutes([
                    { path: 'photoAlbums', component: BlankComp },
                    { path: 'videoAlbums', component: BlankComp },
                ]) ],
            providers: [
                { provide: AppConfig, useValue: configMock }
            ]
        }).compileComponents();
        router = TestBed.get(Router);
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
        expect(location.path()).toEqual('/photoAlbums')
    }));
    it('should navigate to video albums if videoImage is clicked', fakeAsync(() => {
        page.videoImage.click();
        tick();
        expect(location.path()).toEqual('/videoAlbums')
    }));

});

class Page {
    get images()     { return this.queryAll<HTMLImageElement>('img'); }
    get photoImage() { return this.images[0]; }
    get videoImage() { return this.images[1]; }
    get photoTitle() { return this.queryText<HTMLElement>('photo gallery'); }
    get videoTitle() { return this.queryText<HTMLElement>('video gallery'); }

    private fixture: ComponentFixture<GalleryComponent>;
  
    constructor(fixture: ComponentFixture<GalleryComponent>) {
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