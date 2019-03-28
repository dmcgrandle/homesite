import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilenameComponent } from './filename.component';

describe('Download Module: FilenameComponent', () => {
    let component: FilenameComponent;
    let fixture: ComponentFixture<FilenameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilenameComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilenameComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('valueChanged() method', () => {
        let elDebug: DebugElement;
        let el: HTMLInputElement;
        beforeEach(() => {
            component.id = 0;
            component.filename = 'tFile';
            spyOn(component.changed, 'emit');
            fixture.detectChanges();
            elDebug = fixture.debugElement.query(By.css('input'));
            el = elDebug.nativeElement;
        });
        it('should display an input with the value passed in', () => {
            expect(el.value).toEqual('tFile');
        });
        it('should emit a value to custom "changed" event if input value changed with mouse click away', () => {
            el.value = 'newFile';
            elDebug.triggerEventHandler('blur', {target: el});
            fixture.detectChanges();
            expect(component.changed.emit).toHaveBeenCalledWith(
                jasmine.objectContaining({ newFilename: 'newFile' })
            );
        });
        it('should emit a value to custom "changed" event if input value changed with keyboard', () => {
            el.value = 'anotherNewFile';
            elDebug.triggerEventHandler('keyup.enter', {target: el});
            fixture.detectChanges();
            expect(component.changed.emit).toHaveBeenCalledWith(
                jasmine.objectContaining({ newFilename: 'anotherNewFile' })
            );
        });
    });
});
