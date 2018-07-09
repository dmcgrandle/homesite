import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPhotoAlbumsListComponent } from './gallery-photo-albums-list.component';

describe('GalleryPhotoAlbumsListComponent', () => {
  let component: GalleryPhotoAlbumsListComponent;
  let fixture: ComponentFixture<GalleryPhotoAlbumsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryPhotoAlbumsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryPhotoAlbumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
