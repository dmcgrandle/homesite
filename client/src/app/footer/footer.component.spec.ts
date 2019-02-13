import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfig } from '../app.config';
import { AuthService } from '../_services/auth.service';
import { FooterComponent } from './footer.component';

xdescribe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    const tTitle = 'tFooter';
    const tEmail = 'foo@bar.com';
    const configMock = { const: { footer: { title: tTitle, email: tEmail } } };
    const authSpy = jasmine.createSpyObj(['isAuthenticated']);

    function getElementByInnerText<T>(search: string) : T {
        return (Array.from(fixture.nativeElement.querySelectorAll('*')) as T[])
            .filter(el => el['innerText'].toLowerCase() === search.toLowerCase())[0];
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent],
            providers: [
                { provide: AppConfig, useValue: configMock },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        authSpy.isAuthenticated.and.returnValue(true);
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => { expect(component).toBeTruthy("Error: Doesn't create") });

    it('Footer toolbar should only appear if user is authenticated', () => {
        const toolbarWhenAuthenticated = fixture.nativeElement.querySelector('.toolbar');
        expect(toolbarWhenAuthenticated).toEqual(jasmine.any(HTMLElement));
        authSpy.isAuthenticated.and.returnValue(false);
        fixture.detectChanges();
        const toolbarWhenNOTAuthenticated = fixture.nativeElement.querySelector('.toolbar');
        expect(toolbarWhenNOTAuthenticated).toBeNull();
    });
    it('should display the title from the footer configuration', () => {
        expect(getElementByInnerText(tTitle)).toBeTruthy();
    });
    it('should display the email contact from the footer configuration', () => {
        expect(getElementByInnerText(tEmail)).toBeTruthy();
    });
    it('should display a link to the homesite github repo', () => {
        const gitRef = getElementByInnerText<HTMLAnchorElement>('homesite');
        expect(gitRef).toBeTruthy('Error: the reference to homesite should exist');
        expect(gitRef.href.includes('github.com/dmcgrandle/homesite'))
            .toBeTruthy('Error: there should be a link to the github for "homesite".');
    });
});
