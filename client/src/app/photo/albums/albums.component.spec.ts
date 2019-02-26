import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { APIService } from '../_services/api.service';
import { MockAPIService, tPhoto, tAlbum } from '../_services/mock-api-service';
import { Album, Photo } from '../_helpers/classes';
import { AlbumsComponent } from './albums.component';

@Component({selector: 'blank', template: ``}) 
class BlankComp {}

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s } }

describe('AlbumsListComponent', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'createUrlTree']);
    let mockFlex = jasmine.createSpyObj({isActive: true, asObservable: of({mqAlias: 'lg'})});
    const spyParamMap = jasmine.createSpyObj({get: null});
    const mockActivatedRoute = { paramMap: of(spyParamMap), url: '' };
    let reloadSpy: jasmine.Spy;
    let component: AlbumsComponent;
    let fixture: ComponentFixture<AlbumsComponent>;
    let page: Page;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(AlbumsComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        return fixture.whenStable().then(() => fixture.detectChanges());
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlbumsComponent, MockSecurePipe, BlankComp],
            imports: [MatCardModule, MatProgressSpinnerModule, MatDialogModule, HttpClientModule,
                      RouterTestingModule.withRoutes([
                        { path: 'albums', component: BlankComp },
                        { path: 'videoAlbums', component: BlankComp },
                    ])],
            providers: [
                { provide: APIService, useClass: MockAPIService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();
        createComponent();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class Page {
    get images()     { return this.queryAll<HTMLImageElement>('img'); }
    get photoImage() { return this.images[0]; }
    get videoImage() { return this.images[1]; }
    get photoTitle() { return this.queryText<HTMLElement>('photo gallery'); }
    get videoTitle() { return this.queryText<HTMLElement>('video gallery'); }

    private fixture: ComponentFixture<AlbumsComponent>;
  
    constructor(fixture: ComponentFixture<AlbumsComponent>) {
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