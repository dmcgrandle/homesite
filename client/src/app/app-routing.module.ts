import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthService } from './user/_services/auth.service';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';


const routes: Routes = [
    { path: 'photo', loadChildren: './photo/photo.module#PhotoModule' },
    { path: 'video', loadChildren: './video/video.module#VideoModule' },
    { path: 'download', loadChildren: './download/download.module#DownloadModule'},
    { path: 'family', loadChildren: './family/family.module#FamilyModule'},
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ];

  @NgModule({
    imports: [ RouterModule.forRoot(routes/*, { enableTracing: true }*/) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}