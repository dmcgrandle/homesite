import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatFormFieldModule, 
         MatToolbarModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { User } from '../shared/_classes/user-classes';
import { AuthService } from '../shared/_services/auth.service';
import { ForgotDialogComponent, DialogData } from './forgot-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

xdescribe('ForgotDialogComponent', () => {

    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', {
        close: null,
        afterClosed: of({})
    });
    const mockDialog = jasmine.createSpyObj('MatDialog', { open: mockDialogRef });
    const mockDialogData: DialogData = { username: 'tUser'};
    const tEmail = 'foo@bar.com';
    let authSpy = jasmine.createSpyObj('AuthService', ['authForgot']);
    authSpy.user = new User({email: ''});
    let component: ForgotDialogComponent;
    let fixture: ComponentFixture<ForgotDialogComponent>;
    let page: Page;

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(ForgotDialogComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        return fixture.whenStable().then(() => fixture.detectChanges());
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ForgotDialogComponent ],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: MatDialog, useValue: mockDialog },
            ],
            imports: [
                MatInputModule, MatDialogModule, MatFormFieldModule, MatToolbarModule, 
                MatProgressSpinnerModule, FormsModule, BrowserAnimationsModule
            ]
        }).compileComponents();
    }));

    it('should create', async(() => {
        createComponent();
        expect(component).toBeTruthy();
    }));


    describe('HTML Template:', () => {

        beforeEach(async(() => { 
            mockDialogRef.close.calls.reset();
            mockDialog.open.calls.reset();
            authSpy.authForgot.calls.reset();
            authSpy.authForgot.and.returnValue(of(new User({email: tEmail})));
            createComponent();
        }));

        function setEmailInput(newValue: string) {
            page.emailInput.value = newValue; // Note - must be minlength 5 chars to make form valid
            page.emailInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        }

        it('should have an enabled cancel button', () => {
            expect(page.cancelButton).toBeTruthy('Err: Cancel button does not exist.');
            expect(page.cancelButton.disabled).toBeFalsy('Err: Cancel button is disabled.');
        });
        it('should have a disabled submit button', () => {
            expect(page.submitButton).toBeTruthy('Err: Submit button does not exist.');
            expect(page.submitButton.disabled).toBeTruthy('Err: Submit button should be disabled to start.');
        });
    it('should close the component and pass back correct data if cancel is clicked', () => {
        mockDialogRef.close.calls.reset();
        page.cancelButton.click();
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
        it('should still have a disabled submit button if too few characters entered', () => {
            expect(page.emailInput).toBeTruthy('Err: Email input does not exist.');
            expect(page.submitButton.disabled).toBeTruthy();
            setEmailInput('tFOO');
            expect(page.submitButton.disabled).toBeTruthy('Err: 4 characters should not enable "save"');
            expect(authSpy.user.email).toEqual('tFOO'); // test data binding
            authSpy.user.email = '';
        });
        it('should submit current user if email is entered and submit button is clicked', () => {
            spyOn(component, 'onSubmitClick').and.callThrough();
            expect(page.submitButton.disabled).toBeTruthy();
            setEmailInput(tEmail);
            expect(page.submitButton.disabled).toBeFalsy('tEmail should have enabled "save"');
            page.submitButton.click();
            expect(component.onSubmitClick).toHaveBeenCalled();
            expect(authSpy.authForgot).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledWith(AlertMessageDialogComponent, jasmine.objectContaining({
                data: jasmine.objectContaining({ alertMessage: jasmine.stringMatching(tEmail) })
            }));
            authSpy.user.email = ''; // reset for further testing
        });
        it('should display alert on 404 error from backend api when submit button is clicked', () => {
            authSpy.authForgot.and.returnValue(throwError(new HttpErrorResponse({status: 404})));
            setEmailInput(tEmail);
            page.submitButton.click();
            expect(authSpy.authForgot).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledWith(AlertMessageDialogComponent, jasmine.objectContaining({
                data: jasmine.objectContaining({ alertMessage: jasmine.stringMatching(tEmail) })
            }));
            authSpy.user.email = '';
        });
        it('should display alert on non-404 error from backend api when submit button is clicked', () => {
            const errResp = new HttpErrorResponse({status: 403, statusText: 'Forbidden'});
            authSpy.authForgot.and.returnValue(throwError(errResp));
            setEmailInput(tEmail);
            page.submitButton.click();
            expect(authSpy.authForgot).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledWith(AlertMessageDialogComponent, jasmine.objectContaining({
                data: jasmine.objectContaining({ alertMessage: jasmine.stringMatching('Forbidden') })
            }));
            authSpy.user.email = '';
        });

    });

});

class Page {
    get cancelButton() { return this.queryAllSearch<HTMLButtonElement>('button', 'cancel'); }
    get submitButton() { return this.queryAllSearch<HTMLButtonElement>('button', 'submit'); }
    get emailInput()   { return this.queryAllInputs('email'); }

    private fixture: ComponentFixture<ForgotDialogComponent>;
  
    constructor(fixture: ComponentFixture<ForgotDialogComponent>) {
        this.fixture = fixture;
    }
  
    /* query helpers */
    private query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }
    private queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }
    private querySearch<T>(selector: string, search: string): T {
        let result: T = this.query<T>(selector)
        if (result['innerText'].toLowerCase().includes(search.toLowerCase())) {
                return result;
            }
        else return undefined
    }
   private queryAllSearch<T>(selector: string, search: string): T {
        let result: T;
        this.queryAll<HTMLElement>(selector).forEach((item: HTMLElement) => {
            if (item.innerText.toLowerCase().includes(search.toLowerCase())) {
                result = <any>item; // TODO: figure out how else to cast this ...
            }
        });
        return result;
    }
   private queryAllInputs(search: string): HTMLInputElement {
        let result: HTMLInputElement;
        this.queryAll<HTMLInputElement>('input').forEach((item: HTMLInputElement) => {
            if (item.placeholder.toLowerCase().includes(search.toLowerCase())) {
                result = item; 
            }
        });
        return result;
    }
}