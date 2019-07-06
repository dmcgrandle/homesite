import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../user/_services/auth.service';
import { DownloadsComponent } from './downloads/downloads.component';
import { GetFileComponent } from './get-file/get-file.component';

const routes: Routes = [
    { path: '', component: DownloadsComponent, canActivate: [AuthService] },
    { path: 'file/:download', component: GetFileComponent, canActivate: [AuthService] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DownloadRoutingModule {}
