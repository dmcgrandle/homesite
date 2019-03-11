import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

/* Don't want to actually test these components here */
@Component({selector: 'shared-header', template: ''})
class HeaderStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'shared-footer', template: ''})
class FooterStub {}

describe('App Module: AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent, HeaderStub, RouterOutletStub, FooterStub
            ]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'Homesite'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('Homesite');
    }));
/*    it('should render title in a h1 tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Welcome to homesite!');
    })); */
});
