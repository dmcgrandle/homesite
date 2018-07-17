import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryVideoAlbumsComponent } from './gallery-video-albums/gallery-video-albums.component';
import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums/gallery-photo-albums.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { GalleryPhotoPhotosComponent } from './gallery-photo-photos/gallery-photo-photos.component';

const appRoutes: Routes = [
    { path: 'gallery', component: GalleryComponent },
    { path: 'videos', component: GalleryVideoAlbumsComponent },
    { path: 'albums', component: GalleryPhotoAlbumsComponent }, 
    { path: 'albums', children: [
        { path: '**', component: GalleryPhotoAlbumsComponent}
    ]},
    { path: 'photos', children: [
        { path: '**', component: GalleryPhotoPhotosComponent}
    ]},
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