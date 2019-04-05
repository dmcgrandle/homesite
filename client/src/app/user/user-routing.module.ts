import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './_services/auth.service';
import { ManageComponent } from './manage/manage.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
    {
        path: 'user',
        children: [
            // since not lazy loaded, need to define child routes explicitly
            {
                path: 'changepass',
                component: ChangePasswordComponent,
                canActivate: [AuthService]
            },
            { path: 'changepass/:username/:token', component: ChangePasswordComponent },
            { path: 'login', component: LoginComponent },
            { path: 'manage', component: ManageComponent, canActivate: [AuthService] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
