import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../user/_services/auth.service';
import { DownloadsComponent } from './downloads/downloads.component';

const routes: Routes = [
  { path: '', component: DownloadsComponent, canActivate: [AuthService] },
  { path: ':download', component: DownloadsComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadRoutingModule { }
