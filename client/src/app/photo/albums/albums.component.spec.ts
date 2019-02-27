import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { MatCardModule, MatProgressSpinnerModule, MatDialogModule, MatDialog } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';

import { APIService } from '../_services/api.service';
import { MockAPIService, tPhoto, tAlbum, tAlbum2 } from '../_services/mock-api-service.spec';
import { Album, Photo } from '../_helpers/classes';
import { AlbumsComponent } from './albums.component';

@Component({selector: 'blank', template: ``}) 
class BlankComp {}

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s } }

describe('Photo Module: AlbumsListComponent', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'createUrlTree']);
    let mockFlex = jasmine.createSpyObj({isActive: true, asObservable: of({mqAlias: 'lg'})});
    const spyParamMap = jasmine.createSpyObj({get: null});
    const mockActivatedRoute = { paramMap: of(spyParamMap), url: '' };
    const locationSpy = jasmine.createSpyObj('Location', ['go']);
    let reloadSpy: jasmine.Spy;
    let component: AlbumsComponent;
    let location: Location;
    let api: MockAPIService;
    let router: Router;
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
                        { path: 'photo/albums', component: BlankComp },
                        { path: 'photo/photos', component: BlankComp },
                        { path: 'home', component: BlankComp },
                    ])],
            providers: [
                { provide: APIService, useClass: MockAPIService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                // { provide: Router, useValue: routerSpy },
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        location = TestBed.get(Location);
        api = TestBed.get(APIService);
        router = TestBed.get(Router);
        spyOn(router, 'navigate').and.callThrough();
    });

    it('should create', () => {
        createComponent();
        expect(component).toBeTruthy();
    });

    describe('HTML Template', () => {
        it('should display a spinner while loading data, then update data to DOM when returned', fakeAsync(() => {
            fixture = TestBed.createComponent(AlbumsComponent);
            component = fixture.componentInstance;
            page = new Page(fixture);
            TestBed.get(APIService).getAlbumsByURL.and.returnValue(
                of([tAlbum]).pipe(delay(100))
            );
            fixture.detectChanges();
            tick(99);
            expect(component.displayAlbums).toBeUndefined();
            expect(page.spinner).toBeTruthy();
            expect(page.galleryCard).toBeUndefined();
            tick(1);
            expect(component.displayAlbums).toEqual([tAlbum]);
            fixture.detectChanges();
            expect(page.spinner).toBeFalsy();
            expect(page.galleryCard).toBeDefined();
        }));
        describe('After displayAlbums[] has data', () => {
            beforeEach(() => {
                createComponent();
            })
            it('should display a picture link for gallery of pics in this album', () => {
                expect(page.galleryCard).toBeDefined();
            });
            it('should display a picture link for each album nested inside this album', () => {
                expect(page.allCards.length).toEqual(3);
            });
            it('should call updateDisplayAlbum() when an albumCard is clicked', () => {
                spyOn(component, 'updateDisplayAlbum');
                page.albumCard1.click();
                expect(component.updateDisplayAlbum).toHaveBeenCalledWith(tAlbum);
            });
            it('should popup alert msg and navigate to /home if getAlbumsByIdArray() returns error', () => {
                const mockRef = jasmine.createSpyObj({ afterClosed: of('true') });
                const dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(mockRef);
                api.getAlbumsByIdArray.and.returnValue(throwError('error'));
                page.albumCard1.click();
                expect(dialogSpy).toHaveBeenCalled();
                expect(router.navigate).toHaveBeenCalledWith(['/home']);
            });
            it('should update URL in browser window and display new album when an albumCard is clicked', () => {
                routerSpy.createUrlTree.and.returnValue(['tAlbum']);
                expect(component.displayAlbums).toEqual([tAlbum, tAlbum]);
                expect(location.path()).toEqual('');
                page.albumCard1.click();
                expect(location.path()).toEqual('/photo/albums/assets/test1');
                expect(component.displayAlbums).toEqual([tAlbum2, tAlbum2]);
                expect(page.tAlbum2Name).not.toBeDefined();
                fixture.detectChanges();
                expect(page.tAlbum2Name).toBeDefined();
            });
        })

    });

});

class Page {
    get allCards()    { return this.queryAll<HTMLElement>('mat-card'); }
    get galleryCard() { return this.allCards[0]; }
    get albumCard1()  { return this.allCards[1]; }
    get spinner()     { return this.query<HTMLElement>('mat-spinner'); }
    get tAlbum2Name() { return this.queryText<HTMLElement>(tAlbum2.name); }

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