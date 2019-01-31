import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MatDialogModule, MatSelectModule, MatInputModule,
         MatToolbarModule, MatIconModule, MAT_DIALOG_DATA, MatFormFieldModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';

import { User } from '../_classes/user-classes';
import { AuthService } from '../_services/auth.service';
import { EditUserDialogComponent, DialogData } from './edit-user-dialog.component';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditUserDialogComponent', () => {
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
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open'); // stub this
    });

    it('should create', () => {
        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('HTML Template:', () => {
        // let buttons: NodeListOf<HTMLButtonElement>;
        beforeEach(async(() => { createComponent() }));

        it('should have an enabled cancel button', () => {
            expect(page.cancelButton).toBeTruthy('Err: Cancel button does not exist.');
            expect(page.cancelButton.disabled).toBeFalsy('Err: Cancel button is disabled.');
        });
        it('should have a disabled save button', () => {
            expect(page.saveButton).toBeTruthy('Err: Save button does not exist.');
            expect(page.saveButton.disabled).toBeTruthy('Err: Save button is not disabled to start.');
        });
        describe('User should update properly:', () => {
            function testUserDoesUpdate(input: HTMLInputElement, newValue: string, expectedUser: User) {
                input.value = newValue; // Note - must be minlength 5 chars to make form valid
                input.dispatchEvent(new Event('input'));
                fixture.detectChanges(); // click the save button and test the user
                expect(page.saveButton.disabled).toBeFalsy('Err: save button should have enabled');
                spyOn(component, 'onSaveClick').and.callThrough();
                page.saveButton.click();
                expect(component.onSaveClick).toHaveBeenCalled();
                expect(authSpy.authUpdateUser).toHaveBeenCalledWith(expectedUser);
            }
            function testSaveStillDisabled(input: HTMLInputElement) {
                expect(input).toBeTruthy('Err: Input does not exist.');
                expect(page.saveButton.disabled).toBeTruthy(); // test save button is disabled to start
                input.value = 'tFOO'; // Note - must be minlength 5 chars to make form valid
                fixture.detectChanges();
                expect(page.saveButton.disabled).toBeTruthy('Err: 4 characters should not enable "save"');
            }
            describe('with the "name" field:', () => {
                it('should not enable the "save" button if name has too few characters', () => {
                    testSaveStillDisabled(page.nameInput);
                });
                it('should be able to change the field and update the correct user', () => {
                    testUserDoesUpdate(page.nameInput, 'testBAR', new User({name: 'testBAR'}));
                    testUser.name = ''; // reset after testing
                });
            });
            describe('with the "username" field:', () => {
                it('should not enable the "save" button if username has too few characters', () => {
                    testSaveStillDisabled(page.usernameInput);
                });
                it('should be able to change the "username" field and update correct user', () => {
                    testUserDoesUpdate(page.usernameInput, 'testBAZ', new User({username: 'testBAZ'}));
                    testUser.username = '';
                });
            });
            describe('with the "email" field:', () => {
                it('should not enable the "save" button if email has too few characters', () => {
                    testSaveStillDisabled(page.emailInput);
                });
                it('should be able to change the "email" field and update correct user', () => {
                    testUserDoesUpdate(page.emailInput, 'testBAA', new User({email: 'testBAA'}));
                    testUser.email = '';
                });
            });
        });
    });
});

class Page {
    get cancelButton()    { return this.queryAllSearch<HTMLButtonElement>('button', 'cancel'); }
    get saveButton()      { return this.queryAllSearch<HTMLButtonElement>('button', 'save'); }
    get nameInput()       { return this.queryAllInputs('full name'); }
    get usernameInput()   { return this.queryAllInputs('username'); }
    get emailInput()      { return this.queryAllInputs('email'); }
    get newPassInput()    { return this.queryAllInputs('new password'); }
    get verifyPassInput() { return this.queryAllInputs('verify'); }

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