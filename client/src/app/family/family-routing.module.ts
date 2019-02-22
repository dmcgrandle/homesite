import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../user/_services/auth.service';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: AboutComponent, canActivate: [AuthService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyRoutingModule { }
