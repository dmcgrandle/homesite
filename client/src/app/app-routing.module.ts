import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryVideoAlbumsComponent } from './gallery-video-albums/gallery-video-albums.component';
import { GalleryVideoVideosComponent } from './gallery-video-videos/gallery-video-videos.component';
import { GalleryVideoVideoComponent } from './gallery-video-video/gallery-video-video.component';
import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums/gallery-photo-albums.component';
import { GalleryPhotoPhotosComponent } from './gallery-photo-photos/gallery-photo-photos.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';


const appRoutes: Routes = [
    { path: 'gallery', component: GalleryComponent },
    { path: 'photoAlbums', component: GalleryPhotoAlbumsComponent }, 
    { path: 'photoAlbums', children: [
        { path: '**', component: GalleryPhotoAlbumsComponent}
    ]},
    { path: 'photos', children: [
        { path: '**', component: GalleryPhotoPhotosComponent}
    ]},
    { path: 'videoAlbums', component: GalleryVideoAlbumsComponent },
    { path: 'videoAlbums', children: [
        { path: '**', component: GalleryVideoAlbumsComponent}
    ]},
    { path: 'videos', children: [
        { path: '**', component: GalleryVideoVideosComponent}
    ]},
    { path: 'video', children: [
        { path: '**', component: GalleryVideoVideoComponent}
    ]},
    { path: 'downloads', component: DownloadsComponent },
    { path: 'changepass/:username/:token', component: ChangePasswordComponent },
    { path: 'changepass', component: ChangePasswordComponent },
    { path: 'manage', component: ManageUsersComponent },
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