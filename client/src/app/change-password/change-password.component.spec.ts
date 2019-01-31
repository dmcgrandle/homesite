import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatInputModule, MatToolbarModule, MatIconModule, MatDialogModule, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { AuthService } from '../_services/auth.service';
import { User } from '../_classes/user-classes';
import { ChangePasswordComponent } from './change-password.component';
import { of, throwError } from 'rxjs';

xdescribe('ChangePasswordComponent', () => {
    const tUser: Partial<User> = { username: 'tGuest'};
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    const mockAuth = jasmine.createSpyObj('AuthService', {
        authChangePasswordByPassword: of(<Partial<User>>{ username: 'tGuest' }),
        authChangePasswordByToken: of(<Partial<User>>{ username: 'tGuest' }),
    });
    mockAuth.user = tUser; // Add the user property to the mockAuth spy object
    const mockActivatedRoute: Object = {
        snapshot: { 
            paramMap: {
                get: (key: string) => {
                    if (key === 'token') return 'ABCDEFGHIJKL';
                    if (key === 'username') return 'tGuest';
                }
            }
        }
    }; // TODO: There is probably a better way to mock ActivatedRoute
    let chgPassComp: ChangePasswordComponent;
    let chgPassElement: HTMLElement;
    let fixture: ComponentFixture<ChangePasswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangePasswordComponent],
            imports: [HttpClientModule, FormsModule, MatInputModule, MatIconModule,
                MatToolbarModule, MatFormFieldModule, MatDialogModule, BrowserAnimationsModule ],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: AuthService, useValue: mockAuth }
            ]
        })
        .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        chgPassComp = fixture.componentInstance;
    });
    it('should be creatable', () => {
        expect(chgPassComp).toBeTruthy();
    });
    it('should be successfully initialized - onInit() called - using email token validation', () => {
        fixture.detectChanges();
        expect(chgPassComp.knowExisting).toBeFalsy();
        expect(chgPassComp.auth.user.username).toEqual('tGuest');
    });
    it('should be successfully initialized - onInit() called - using password validation', () => {
        const route = TestBed.get(ActivatedRoute);
        spyOn(route.snapshot.paramMap, 'get').and.returnValue(null); // null token means password validation
        fixture.detectChanges();
        expect(chgPassComp.knowExisting).toBeTruthy();
    });

    describe('onChangePassword() Method', () => {
        let auth: AuthService;

        beforeEach(() => {
            auth = TestBed.get(AuthService);
            fixture.detectChanges();
            chgPassComp.existingPass = 'tExistingPass';
            spyOn(chgPassComp, 'successfulChange');
            spyOn(chgPassComp, 'errorChange');
            chgPassComp.knowExisting = true;
        });
        it('should successfully initiate a change password by password request', () => {
            chgPassComp.onChangePassword('tNewPass');
            expect(auth.authChangePasswordByPassword).toHaveBeenCalledTimes(1);
            expect(auth.authChangePasswordByToken).not.toHaveBeenCalled();
            expect(chgPassComp.successfulChange).toHaveBeenCalledWith(tUser);
            expect(chgPassComp.errorChange).not.toHaveBeenCalled();
            expect(auth.user.password).toEqual('tExistingPass');
        });
        it('should successfully initiate a change password by token request', () => {
            chgPassComp.knowExisting = false;
            chgPassComp.onChangePassword('tNewPass');
            expect(auth.authChangePasswordByToken).toHaveBeenCalledTimes(1); // called first time
            expect(auth.authChangePasswordByPassword).toHaveBeenCalledTimes(1); //not called again
            expect(chgPassComp.successfulChange).toHaveBeenCalledWith(tUser);
            expect(chgPassComp.errorChange).not.toHaveBeenCalled();
            expect(auth.user.password).toEqual('tNewPass');
        });
        it('should process error from authChangePasswordByPassword on error', () => {
            mockAuth.authChangePasswordByPassword.and.returnValue(throwError('tError'));
            chgPassComp.onChangePassword('tNewPass');
            expect(auth.authChangePasswordByPassword).toHaveBeenCalledTimes(2); // called again
            expect(chgPassComp.successfulChange).not.toHaveBeenCalled();
            expect(chgPassComp.errorChange).toHaveBeenCalledWith('tError');
        });
        it('should process error from authChangePasswordByToken on error', () => {
            mockAuth.authChangePasswordByToken.and.returnValue(throwError('tError'));
            chgPassComp.knowExisting = false;
            chgPassComp.onChangePassword('tNewPass');
            expect(auth.authChangePasswordByToken).toHaveBeenCalledTimes(2);
            expect(chgPassComp.successfulChange).not.toHaveBeenCalled();
            expect(chgPassComp.errorChange).toHaveBeenCalledWith('tError');
        });
    });

    describe('successfulChange() Method', () => {
        let dialog: MatDialog;
        let router: Router;

        beforeEach(() => {
            dialog = TestBed.get(MatDialog);
            router = TestBed.get(Router);
            fixture.detectChanges();
            spyOn(dialog, 'open').and.returnValue({ afterClosed : () => of({}) });
            chgPassComp.successfulChange(<User>tUser);
        });
        it('should successfully initiate an Alert Message dialog open to display success message', () => {
            expect(dialog.open).toHaveBeenCalled();
        });
        it('should successfully try to navigate back to gallery when dialog closes', () => {
            expect(router.navigate).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/gallery']);
        });
    });

    describe('errorChange() Method', () => {
        let dialog: MatDialog;
        let router: Router;

        beforeEach(() => {
            dialog = TestBed.get(MatDialog);
            router = TestBed.get(Router);
            fixture.detectChanges();
            spyOn(dialog, 'open').and.returnValue({ afterClosed : () => of({}) });
            chgPassComp.errorChange('tError');
        });
        it('should successfully initiate an AlertMessage dialog open to display error message', () => {
            expect(dialog.open).toHaveBeenCalled();
        });
        it('should successfully try to navigate back to login when dialog closes', () => {
            expect(router.navigate).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('HTML Template', () => {
        let buttons: NodeListOf<HTMLButtonElement>;

        beforeEach(() => {
            chgPassElement = fixture.nativeElement;
        });

        describe('Initialized with email token validation', () => {
            beforeEach(() => {
                fixture.detectChanges();
                buttons = chgPassElement.querySelectorAll('button');
            });
            it('should display two inputs (no existing-pass field)', () => {
                expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(2);
            });
            it('initially "Change Password" button should be disabled', () => {
                expect(buttons[1].disabled).toBeTruthy();
            });
            it('"Change Password" button should NOT enable with invalid form data', () => {
                fixture.whenStable().then(() => { // let initial state settle
                    chgPassComp.chgPassForm.form.setValue({ newpass: 'validP', newpasschk: 'not' });
                    chgPassComp.chgPassForm.form.get('newpass').markAsDirty(); // not pristine
                    fixture.detectChanges();
                    fixture.whenStable().then(() => { // now let changes settle
                        expect(chgPassComp.chgPassForm.valid).toBe(false, 'newPassChk is < 5 chars');
                        expect(buttons[1].disabled).toBeTruthy('button should be disabled');
                    });
                });
            });
            it('"Change Password" button should enable with valid form data', async(() => {
                fixture.whenStable().then(() => { // let initial state settle
                    chgPassComp.chgPassForm.form.setValue({ newpass: 'validP', newpasschk: 'validP' });
                    chgPassComp.chgPassForm.form.get('newpass').markAsDirty(); // not pristine
                    fixture.detectChanges();
                    fixture.whenStable().then(() => { // now let changes settle
                        fixture.detectChanges();
                        expect(chgPassComp.chgPassForm.valid).toBe(true, 'form should be valid');
                        expect(buttons[1].disabled).toBeFalsy('button should be enabled');
                    });
                });
            }));
        });

        describe('Initialized with password validation', () => {

            beforeEach(() => {
                const route = TestBed.get(ActivatedRoute);
                spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);
                fixture.detectChanges();
                buttons = chgPassElement.querySelectorAll('button');
                const button = fixture.debugElement.nativeElement.querySelector('#signInWithGithub');
            });
                it('should display three inputs (includes existing-pass field)', () => {
                expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(3);
            });
            it('initially "Change Password" button should be disabled', () => {
                expect(buttons[1].disabled).toBeTruthy();
            });
            it('"Change Password" button should NOT enable with invalid form data', async(() => {
                fixture.whenStable().then(() => { // form controls need to register w/ group
                    chgPassComp.chgPassForm.form.setValue({
                        exgpass: 'old', newpass: 'validP', newpasschk: 'validP'
                    }); // sets the new values in the form and dispatches event to update
                    chgPassComp.chgPassForm.form.get('newpass').markAsDirty(); // not pristine
                    fixture.detectChanges(); // wait for events to change UI
                    expect(chgPassComp.chgPassForm.valid).toBe(false, 'form should be invalid');
                    expect(buttons[1].disabled).toBeTruthy('button should NOT be enabled');
                });
            }));
            it('"Change Password" button should enable with valid form data', async(() => {
                fixture.whenStable().then(() => {
                    chgPassComp.chgPassForm.form.setValue({
                        exgpass: 'oldPass', newpass: 'validP', newpasschk: 'validP'
                    });
                    chgPassComp.chgPassForm.form.get('newpass').markAsDirty();
                    fixture.detectChanges();
                    expect(chgPassComp.chgPassForm.valid).toBe(true, 'form should be valid');
                    expect(buttons[1].disabled).toBeFalsy('button should be enabled');
                });
            }));
        });
    });
});
