import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProgressBarComponent } from './download-progress-bar.component';

describe('DownloadProgressBarComponent', () => {
  let component: DownloadProgressBarComponent;
  let fixture: ComponentFixture<DownloadProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
