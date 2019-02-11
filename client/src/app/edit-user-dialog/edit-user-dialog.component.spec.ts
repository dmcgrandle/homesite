import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MatDialogModule, MatSelectModule, MatInputModule,
         MatToolbarModule, MatIconModule, MAT_DIALOG_DATA, MatFormFieldModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';
import { DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { EditUserDialogComponent, DialogData } from './edit-user-dialog.component';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

xdescribe('EditUserDialogComponent', () => {
    const testUser: User = new User();
    const mockDialogRef = jasmine.createSpyObj('mockDialogRef', ['close']);
    const mockDialogData: DialogData = { user: testUser};
    const authSpy = jasmine.createSpyObj({ authUpdateUser: of(testUser) });
    let component: EditUserDialogComponent;
    let fixture: ComponentFixture<EditUserDialogComponent>;
    let dialogSpy: jasmine.Spy;
    let page: Page; // declared at the end of this file

    function createComponent(): Promise<any> {
        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        // 1st change detection triggers ngOnInit
        fixture.detectChanges();
        return fixture.whenStable().then(() => {
        // 2nd change detection updates the display
            fixture.detectChanges();
        });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditUserDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: AuthService, useValue: authSpy }
            ],
            imports: [FormsModule, MatIconModule, MatDialogModule, MatToolbarModule, 
                MatInputModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [EditUserDialogComponent]
            }
        })
        .compileComponents();
    }));

    beforeEach(() => {
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue({
            afterClosed: () => of(0)
        });
    });

    it('should create', () => {
        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('Methods', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(EditUserDialogComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('onSaveClick() should open Success dialog if update is successful', () => {
            mockDialogRef.close.calls.reset();
            authSpy.authUpdateUser.and.returnValue(of(new User()));
            component.onSaveClick('tPass');
            expect(dialogSpy).toHaveBeenCalledWith(AlertMessageDialogComponent, jasmine.objectContaining({
                data: jasmine.objectContaining({heading: 'Success'})
            }));
            expect(mockDialogRef.close).toHaveBeenCalled();
            component.data.user.password = ''; // reset it or other tests will fail.
        });
        it('onSaveClick() should open Error dialog if update is NOT successful', () => {
            spyOn(component, 'copyToDialogData');
            mockDialogRef.close.calls.reset();
            authSpy.authUpdateUser.and.returnValue(throwError({error: 'Network Timeout'}));
            component.onSaveClick('tPass');
            expect(dialogSpy).toHaveBeenCalledWith(AlertMessageDialogComponent, jasmine.objectContaining({ 
                data: jasmine.objectContaining({heading: 'Error'})
            }));
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(component.copyToDialogData).toHaveBeenCalledWith(component.saveUser);
            component.data.user.password = '';
        });
        it('copyToDialogData() should copy the given user without password to the component.data.user object', () => {
            const testUser = new User({name: 'tFooName', password: 'tPass'});
            component.copyToDialogData(testUser);
            delete testUser.password;
            expect(component.data.user).toEqual(testUser);
            component.data.user.password = '';
        })


    });

    describe('HTML Template:', () => { // Mostly integration tests
        beforeEach(async(() => { 
            createComponent();
            authSpy.authUpdateUser.calls.reset();
            authSpy.authUpdateUser.and.returnValue(of(new User()));
        }));

        it('should have an enabled cancel button', () => {
            expect(page.cancelButton).toBeTruthy('Err: Cancel button does not exist.');
            expect(page.cancelButton.disabled).toBeFalsy('Err: Cancel button is disabled.');
        });
        it('should have a disabled save button', () => {
            expect(page.saveButton).toBeTruthy('Err: Save button does not exist.');
            expect(page.saveButton.disabled).toBeTruthy('Err: Save button is not disabled to start.');
        });
        it('should close the component if cancel is clicked', () => {
            mockDialogRef.close.calls.reset();
            page.cancelButton.click();
            expect(mockDialogRef.close).toHaveBeenCalled();
        });
        describe('User should update properly:', () => {
            function testIfUserDoesUpdate(input: HTMLInputElement, newValue: string, expectedUser: User) {
                input.value = newValue; // Must be minlength 5 chars to make form valid
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(page.saveButton.disabled).toBeFalsy('Err: save button should have enabled');
                spyOn(component, 'onSaveClick').and.callThrough();
                page.saveButton.click();
                expect(component.onSaveClick).toHaveBeenCalled();
                expect(authSpy.authUpdateUser).toHaveBeenCalledWith(expectedUser);
            }
            function testIfSaveStillDisabled(input: HTMLInputElement) {
                expect(input).toBeTruthy('Err: Input does not exist.');
                expect(page.saveButton.disabled).toBeTruthy();
                input.value = 'tFOO'; // Note - must be minlength 5 chars to make form valid
                fixture.detectChanges();
                expect(page.saveButton.disabled).toBeTruthy('Err: 4 characters should not enable "save"');
            }
            describe('with the "name" field:', () => {
                it('should not enable the "save" button if name has too few characters', () => {
                    testIfSaveStillDisabled(page.nameInput);
                });
                it('should be able to change the field and update the correct user', () => {
                    testIfUserDoesUpdate(page.nameInput, 'testBAR', new User({name: 'testBAR'}));
                    testUser.name = ''; // reset after testing
                });
            });
            describe('with the "username" field:', () => {
                it('should not enable the "save" button if username has too few characters', () => {
                    testIfSaveStillDisabled(page.usernameInput);
                });
                it('should be able to change the "username" field and update correct user', () => {
                    testIfUserDoesUpdate(page.usernameInput, 'testBAZ', new User({username: 'testBAZ'}));
                    testUser.username = '';
                });
            });
            describe('with the "email" field:', () => {
                it('should not enable the "save" button if email has too few characters', () => {
                    testIfSaveStillDisabled(page.emailInput);
                });
                it('should be able to change the "email" field and update correct user', () => {
                    testIfUserDoesUpdate(page.emailInput, 'testBAA', new User({email: 'testBAA'}));
                    testUser.email = '';
                });
            });
            describe('with the "level" drop down list select:', () => {
                it('should be able to change the "level" selection and update correct user', () => {
                    expect(page.levelSelect).toBeTruthy('Err: Level Select does not exist.');
                    expect(page.saveButton.disabled).toBeTruthy();
                    page.levelSelect.click(); // clicking opens up the options list
                    fixture.detectChanges();
                    expect(page.levelCurSelected.innerText).toContain('0 - Delete This User');
                    page.levelSelectOpts[3].click();
                    fixture.detectChanges();
                    expect(page.levelCurSelected.innerText).toContain('3 - Uploader');
                    expect(page.saveButton.disabled).toBeFalsy('Err: changing selection should enable "save"');
                    spyOn(component, 'onSaveClick').and.callThrough();
                    page.saveButton.click();
                    expect(component.onSaveClick).toHaveBeenCalled();
                    expect(authSpy.authUpdateUser).toHaveBeenCalledWith(new User({level: 3}));
                    // TODO : Test with keyboard as well, but couldn't get this to work:
                    // const event = new KeyboardEvent('keypress', {key: 'ArrowDown'}); // down arrow
                    testUser.level = 0;
                });
            });
            describe('with the "new password" and "verify password" fields:', () => {
                it('should not enable the "save" button if the new or verify passwords have too few characters', () => {
                    testIfSaveStillDisabled(page.newPassInput);
                    testIfSaveStillDisabled(page.verifyPassInput);
                });
                it('should be able to change the password fields and update correct user', () => {
                    page.newPassInput.value = 'testPASS';
                    page.newPassInput.dispatchEvent(new Event('input'));
                    testIfUserDoesUpdate(page.verifyPassInput, 'testPASS', new User({password: 'testPASS'}));
                    testUser.password = '';
                });
            });
        });
    });
});

class Page {
    get cancelButton()     { return this.queryAllSearch<HTMLButtonElement>('button', 'cancel'); }
    get saveButton()       { return this.queryAllSearch<HTMLButtonElement>('button', 'save'); }
    get nameInput()        { return this.queryAllInputs('full name'); }
    get usernameInput()    { return this.queryAllInputs('username'); }
    get emailInput()       { return this.queryAllInputs('email'); }
    get levelSelect()      { return this.query<HTMLSelectElement>('mat-select'); }
    get levelSelectOpts()  { return this.queryParentAll<HTMLElement>('mat-option'); }
    get levelCurSelected() { return this.queryParent<HTMLElement>('.mat-selected')} 
    get levelCurActive()   { return this.queryParent<HTMLElement>('.mat-active')} 
    get newPassInput()     { return this.queryAllInputs('new password'); }
    get verifyPassInput()  { return this.queryAllInputs('verify'); }
    get dialogContainer()  { return this.queryParentAll<HTMLElement>('.edit-user-container'); }

    private fixture: ComponentFixture<EditUserDialogComponent>;
  
    constructor(fixture: ComponentFixture<EditUserDialogComponent>) {
        this.fixture = fixture;
    }
  
    /* query helpers */
    private query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }
  
    private queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }

    // Sometimes elements (like mat-option in the OverlayContainer) are not in the component ...
    private queryParent<T>(selector: string): T {
        return this.fixture.nativeElement.parentElement.querySelector(selector);
    }
    private queryParentAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.parentElement.querySelectorAll(selector);
    }

/*
  Next three functions are to take a more confidence based approach to testing by attempting
  to test things as the user would attempt to use it.  So for example, the user would look
  for a button with the word 'cancel' on it to dismiss the dialog box and then press it,
  so testing that same way will give confidence that this component is working.  It also
  is not dependendent on implementation details such as the 'cancel' button returns as the
  second in an array of queryAll for 'button'. 
*/

    /**
    * @param {string} selector - CSS selector to identify an element
    * @param {string} search - Search string to look for in .innerText
    */
    private querySearch<T>(selector: string, search: string): T {
        let result: T = this.query<T>(selector)
        if (result['innerText'].toLowerCase().includes(search.toLowerCase())) {
                return result;
            }
        else return undefined
    }

    /**
    * @param {string} selector - CSS selector to identify a list of elements
    * @param {string} search - Search string to look for in .innerText
    */
   private queryAllSearch<T>(selector: string, search: string): T {
        let result: T;
        this.queryAll<HTMLElement>(selector).forEach((item: HTMLElement) => {
            if (item.innerText.toLowerCase().includes(search.toLowerCase())) {
                result = <any>item; // ugh - not sure how else to cast this ...
            }
        });
        return result;
    }

    /**
    * @param {string} search - Search string to look for in placeholder attribute
    */
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