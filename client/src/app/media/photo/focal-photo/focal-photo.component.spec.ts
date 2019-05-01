import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocalPhotoComponent } from './focal-photo.component';

fdescribe('FocalPhotoComponent', () => {
    let component: FocalPhotoComponent;
    let fixture: ComponentFixture<FocalPhotoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FocalPhotoComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FocalPhotoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
