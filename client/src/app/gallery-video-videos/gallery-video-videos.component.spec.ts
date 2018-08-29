import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryVideoVideosComponent } from './gallery-video-videos.component';

describe('GalleryVideoVideosComponent', () => {
    let component: GalleryVideoVideosComponent;
    let fixture: ComponentFixture<GalleryVideoVideosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryVideoVideosComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryVideoVideosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
