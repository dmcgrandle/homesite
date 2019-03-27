import { Component, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { MatCardModule, MatProgressSpinnerModule, MatDialogModule, MatDialog } from '@angular/material';
// import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router/*, ActivatedRoute */} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// import { AlertMessageDialogComponent } from '../../shared/alert-message-dialog/alert-message-dialog.component';
import { MasonryGridDirective } from '../../shared/masonry/masonry-grid.directive';
import { MasonryItemDirective } from '../../shared/masonry/masonry-item.directive';
import { CardComponent } from '../../shared/card/card.component';

import { APIService } from '../_services/api.service';
import { MockAPIService, tAlbum, tAlbum1, tAlbum2, tAlbum3, tAlbum4, tPhoto } from '../_services/mock-api-service.spec';
// import { Album, Photo } from '../_helpers/classes';
import { AlbumsComponent } from './albums.component';

@Component({selector: 'blank', template: ``}) 
class BlankComp {}

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform { transform(s) { return s } }

fdescribe('Photo Module: AlbumsComponent', () => {
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
            declarations: [
                AlbumsComponent,
                MockSecurePipe,
                BlankComp,
                CardComponent,
                MasonryGridDirective,
                MasonryItemDirective
            ],
            imports: [
                MatCardModule, 
                MatProgressSpinnerModule, 
                MatDialogModule, 
                RouterTestingModule.withRoutes([
                    // { path: 'photo/albums', component: BlankComp },
                    { path: 'photo/photos', component: AlbumsComponent },
                    { path: 'photo/photos', children: [
                        { path: '**', component: AlbumsComponent }
                    ]},
                    { path: 'home', component: BlankComp },
                ])
            ],
            providers: [
                { provide: APIService, useClass: MockAPIService },
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        location = TestBed.get(Location);
        location.go('photo/albums/tAlbum'); // setup initial test URL
        api = TestBed.get(APIService);
        api.curAlbum = tAlbum; // mock the tap() set curAlbum in the original api service
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
            api.getAlbumsByURL.and.returnValue(of([tAlbum]).pipe(delay(100)));
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
            });
            it('should display a picture link for gallery of pics in this album', () => {
                expect(page.galleryCard).toBeDefined();
            });
            it('should display a picture link for each album nested inside this album', () => {
                expect(page.allCards.length).toEqual(4);
            });
            it('should call updateDisplayAlbum() when an albumCard is clicked', () => {
                spyOn(component, 'updateDisplayAlbum');
                page.albumCard1.click();
                expect(component.updateDisplayAlbum).toHaveBeenCalledWith(tAlbum1);
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
                expect(component.displayAlbums).toEqual([tAlbum1, tAlbum2, tAlbum3]);
                expect(location.path()).toEqual('/photo/albums/tAlbum');
                page.albumCard1.click();
                expect(location.path()).toEqual('/photo/albums/tAlbum/tAlbum1');
                expect(component.displayAlbums).toEqual([tAlbum4]);
                expect(page.anyElementWithText(tAlbum4.name)).not.toBeDefined();
                fixture.detectChanges();
                expect(page.anyElementWithText(tAlbum4.name)).toBeDefined();
            });
            it('should navigate to Photos /photo/photos/<album> when an album with only photos is clicked', fakeAsync(() => {
                expect(component.displayAlbums).toEqual([tAlbum1, tAlbum2, tAlbum3]);
                expect(location.path()).toEqual('/photo/albums/tAlbum');
                page.albumCard2.click();
                flush();
                expect(location.path()).toEqual('/photo/photos/tAlbum/tAlbum2');
            }));
        });
    });
});

class Page {
    get allCards()    { return this.queryAll<HTMLElement>('mat-card'); }
    get galleryCard() { return this.allCards[0]; }
    get albumCard1()  { return this.allCards[1]; }
    get albumCard2()  { return this.allCards[2]; }
    get spinner()     { return this.query<HTMLElement>('mat-spinner'); }

    private fixture: ComponentFixture<AlbumsComponent>;
  
    constructor(fixture: ComponentFixture<AlbumsComponent>) {
        this.fixture = fixture;
    }
  
    public anyElementWithText<T>(search: string) : T {
        return this.queryText<T>(search);
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