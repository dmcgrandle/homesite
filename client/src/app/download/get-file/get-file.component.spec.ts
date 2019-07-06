import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFileComponent } from './get-file.component';

describe('GetFileComponent', () => {
  let component: GetFileComponent;
  let fixture: ComponentFixture<GetFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
