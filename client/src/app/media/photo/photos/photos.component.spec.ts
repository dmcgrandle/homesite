import {
    Pipe,
    PipeTransform,
    HostListener,
    Directive,
    DebugElement
} from '@angular/core';
import {
    async,
    fakeAsync,
    tick,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
    MockAPIService,
    tAlbum,
    tPhoto,
    tPhoto1,
    tPhoto2,
    tPhoto3
} from '../_services/mock-api-service.spec';
import { ThumbnailsComponent } from '../thumbnails/thumbnails.component';
import { PhotosComponent } from './photos.component';
import { APIService } from '../_services/api.service';


class Page {
    get largeCard()    { return this.query<HTMLElement>('.large'); }
    get allThumbs()    { return this.queryAll<HTMLElement>('.img-thumbs'); }
    get outerSpinner() { return this.query<HTMLElement>('.outer-spinner'); }
    get innerSpinner() { return this.query<HTMLElement>('.inner-spinner'); }
    get title()        { return this.query<HTMLElement>('.title'); }
    get downloadLink() { return this.query<HTMLElement>('a[download]'); }
    get largeCaption() { return this.query<HTMLElement>('mat-card-footer'); }

    private fixture: ComponentFixture<PhotosComponent>;

    constructor(fixture: ComponentFixture<PhotosComponent>) {
        this.fixture = fixture;
    }

    public anyElementWithText<T>(search: string): T {
        return this.queryText<T>(search);
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

const pipeSpy = jasmine.createSpy().and.callFake(s => s);

@Pipe({ name: 'secure' })
class MockSecurePipe implements PipeTransform {
    transform = pipeSpy;
}

/* Mock for anchor elements with download attributes to override
   default anchor element to prevent test from actually downloading */
@Directive({ selector: 'a[download]' })
class AnchorDownloadDirective {
    clicked = 'no'; // set a variable we can test for clicked
    @HostListener('click', ['$event'])
    onclick(e: Event) {
        e.preventDefault(); // stop the click from downloading a file
        this.clicked = 'yes';
    }
}

describe('Photo Module: PhotosComponent', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeMock = { url: of(tAlbum.path) };
    let api: MockAPIService;
    let component: PhotosComponent;
    let fixture: ComponentFixture<PhotosComponent>;
    let page: Page;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(PhotosComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        return fixture.whenStable().then(() => fixture.detectChanges());
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PhotosComponent, MockSecurePipe, AnchorDownloadDirective, ThumbnailsComponent],
            imports: [
                MatIconModule,
                MatCardModule,
                MatProgressSpinnerModule,
                MatDialogModule,
                FlexLayoutModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: APIService, useClass: MockAPIService },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeMock }
            ]
        }).compileComponents();
      }));

      beforeEach(() => {
        api = TestBed.get(APIService);
    });

    it('should create', async(() => {
        createComponent();
        expect(component).toBeTruthy();
    }));

    describe('HTML Template', () => {
        it('should display a spinner while loading data, then update data to DOM when returned', fakeAsync(() => {
            fixture = TestBed.createComponent(PhotosComponent);
            component = fixture.componentInstance;
            page = new Page(fixture);
            api.getAlbumByURL.and.returnValue(of([tAlbum]).pipe(delay(100)));
            fixture.detectChanges();
            // note: next line won't enter the subscribe until after the observable completes ... :)
            api.thumbs$.subscribe(thumbs => expect(thumbs).toEqual([tPhoto1, tPhoto2, tPhoto3]));
            tick(99);
            expect(page.outerSpinner).toBeDefined('The outer spinner is not displayed in the DOM.');
            expect(page.largeCard).toBeNull('The largeCard is incorrectly in the DOM.');
            api.curAlbum = tAlbum; // mock the tap() in the original api service which sets curAlbum
            tick(1); // now getAlbumByURL Observable will complete
            fixture.detectChanges();
            expect(page.outerSpinner).toBeNull('The outer spinner is incorrectly still in the DOM.');
            expect(page.largeCard).toBeDefined('The largeCard is not displayed in the DOM.');
            // flush();
        }));
        describe('After photos[] has data', () => {
            beforeEach(() => { createComponent(); });
            it(`should display the current album's name in the title`, () => {
                expect(page.title.innerText).toContain('tAlbum1', 'There is no title in the DOM');
            });
            it(`the download link should download the image displayed in largeCard.`, () => {
                const anchorDE: DebugElement[] = fixture.debugElement.queryAll(By.directive(AnchorDownloadDirective));
                const anchor: AnchorDownloadDirective = anchorDE[0].injector.get(AnchorDownloadDirective);
                expect(anchorDE.length).toEqual(1, 'there is more than one download link in the template');
                expect(page.downloadLink).toBeDefined('There is no download link in the DOM');
                expect(anchor.clicked).toEqual('no', 'the download link should NOT have been clicked yet.');
                page.downloadLink.click();
                expect(pipeSpy).toHaveBeenCalled();
                expect(anchor.clicked).toEqual('yes', 'the download link was not clicked.');
                expect(page.downloadLink.getAttribute('download')).toEqual('tFile1', 'wrong file being downloaded');
            });
            it(`should display the caption, or a filename if caption doesn't exist, for the large Image`, () => {
                api.thumbs$.subscribe(thumbs => {
                    expect(page.largeCaption.innerText).toContain(thumbs[0].filename, `filename wasn't displayed in DOM`);
                    page.allThumbs[1].click();
                    fixture.detectChanges();
                    expect(page.largeCaption.innerText).toContain(thumbs[1].caption, `caption wasn't displayed properly`);
                });
            });
            // it('should call updateDisplayAlbum() when an albumCard is clicked', () => {
            //     spyOn(component, 'updateDisplayAlbum');
            //     page.albumCard1.click();
            //     expect(component.updateDisplayAlbum).toHaveBeenCalledWith(tAlbum1);
            // });
            // it('should popup alert msg and navigate to /home if getAlbumsByIdArray() returns error', () => {
            //     const mockRef = jasmine.createSpyObj({ afterClosed: of('true') });
            //     const dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(mockRef);
            //     api.getAlbumsByIdArray.and.returnValue(throwError('error'));
            //     page.albumCard1.click();
            //     expect(dialogSpy).toHaveBeenCalled();
            //     expect(router.navigate).toHaveBeenCalledWith(['/home']);
            // });
            // it('should update URL in browser window and display new album when an albumCard is clicked', () => {
            //     expect(component.displayAlbums).toEqual([tAlbum1, tAlbum2, tAlbum3]);
            //     expect(location.path()).toEqual('/media/photo/albums/tAlbum');
            //     page.albumCard1.click();
            //     expect(location.path()).toEqual('/media/photo/albums/tAlbum/tAlbum1');
            //     expect(component.displayAlbums).toEqual([tAlbum4]);
            //     expect(page.anyElementWithText(tAlbum4.name)).not.toBeDefined();
            //     fixture.detectChanges();
            //     expect(page.anyElementWithText(tAlbum4.name)).toBeDefined();
            // });
            // it('should navigate to Photos /photo/photos/<album> when an album with only photos is clicked', fakeAsync(() => {
            //     expect(component.displayAlbums).toEqual([tAlbum1, tAlbum2, tAlbum3]);
            //     expect(location.path()).toEqual('/media/photo/albums/tAlbum');
            //     page.albumCard2.click();
            //     flush();
            //     expect(location.path()).toEqual('/photo/photos/tAlbum/tAlbum2');
            // }));
        });
    });


});
