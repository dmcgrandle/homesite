import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums.component';

describe('GalleryPhotoAlbumsListComponent', () => {
  let component: GalleryPhotoAlbumsComponent;
  let fixture: ComponentFixture<GalleryPhotoAlbumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryPhotoAlbumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryPhotoAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
