import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageDialogComponent } from './alert-message-dialog.component';

describe('AlertMessageDialogComponent', () => {
  let component: AlertMessageDialogComponent;
  let fixture: ComponentFixture<AlertMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
