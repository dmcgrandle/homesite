import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryVideoAlbumListComponent } from './gallery-video-albums-list/gallery-video-albums-list.component';
import { GalleryPhotoAlbumsListComponent } from './gallery-photo-albums-list/gallery-photo-albums-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';

const appRoutes: Routes = [
    { path: 'gallery', component: GalleryComponent },
    { path: 'videos', component: GalleryVideoAlbumListComponent },
    { path: 'photo-albums', component: GalleryPhotoAlbumsListComponent },
    { path: 'downloads', component: DownloadsComponent },
    { path: 'changepass/:username/:token', component: ChangePasswordComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ];

  @NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
  })
  export class AppRoutingModule {}