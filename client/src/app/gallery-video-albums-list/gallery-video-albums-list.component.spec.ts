import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryVideoAlbumListComponent } from './gallery-video-albums-list.component';

describe('GalleryVideosComponent', () => {
  let component: GalleryVideoAlbumListComponent;
  let fixture: ComponentFixture<GalleryVideoAlbumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryVideoAlbumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryVideoAlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
