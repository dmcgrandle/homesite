import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryVideoVideoComponent } from './gallery-video-video.component';

describe('GalleryVideoVideoComponent', () => {
  let component: GalleryVideoVideoComponent;
  let fixture: ComponentFixture<GalleryVideoVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryVideoVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryVideoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
