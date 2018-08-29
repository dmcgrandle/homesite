import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPhotoPhotosComponent } from './gallery-photo-photos.component';

describe('GalleryPhotoPhotosComponent', () => {
    let component: GalleryPhotoPhotosComponent;
    let fixture: ComponentFixture<GalleryPhotoPhotosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryPhotoPhotosComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryPhotoPhotosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
