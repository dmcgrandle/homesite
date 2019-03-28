import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { HomesiteComponent } from './app.component';

/* Don't want to actually test these components here */
@Component({selector: 'shared-header', template: ''})
class HeaderStubComponent {}

// tslint:disable-next-line:component-selector
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {}

@Component({selector: 'shared-footer', template: ''})
class FooterStubComponent {}

describe('App Module: AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomesiteComponent,
                HeaderStubComponent,
                RouterOutletStubComponent,
                FooterStubComponent
            ]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(HomesiteComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'Homesite'`, async(() => {
        const fixture = TestBed.createComponent(HomesiteComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('Homesite');
    }));
});
