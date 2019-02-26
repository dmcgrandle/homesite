import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import {
    MatToolbarModule, 
    MatProgressSpinnerModule, 
    MatInputModule, 
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule, 
    MatSelectModule, 
    MatButtonModule,
    MatDialogModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { UsersRoutingModule } from './user-routing.module';
import { AuthService } from './_services/auth.service';
import { ManageComponent } from './manage/manage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotDialogComponent } from './forgot-dialog/forgot-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedModule,
        FormsModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule
    ],
    declarations: [
        ManageComponent,
        LoginComponent,
        ForgotDialogComponent,
        ChangePasswordComponent,
        RegisterComponent,
        EditDialogComponent
    ],
    entryComponents: [
        EditDialogComponent, 
        RegisterComponent, 
        ForgotDialogComponent
    ]
})
export class UserModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: UserModule,
            providers: [AuthService]
        }
    }
}
