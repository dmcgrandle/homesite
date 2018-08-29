import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryVideoAlbumsComponent } from './gallery-video-albums.component';

describe('GalleryVideosComponent', () => {
    let component: GalleryVideoAlbumsComponent;
    let fixture: ComponentFixture<GalleryVideoAlbumsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryVideoAlbumsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryVideoAlbumsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
