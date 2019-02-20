import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthService } from './user/_services/auth.service';
import { GalleryComponent } from './gallery/gallery.component';
// import { GalleryVideoAlbumsComponent } from './gallery-video-albums/gallery-video-albums.component';
// import { GalleryVideoVideosComponent } from './gallery-video-videos/gallery-video-videos.component';
// import { GalleryVideoVideoComponent } from './gallery-video-video/gallery-video-video.component';
// import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums/gallery-photo-albums.component';
// import { GalleryPhotoPhotosComponent } from './gallery-photo-photos/gallery-photo-photos.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';


const routes: Routes = [
    { path: 'gallery', component: GalleryComponent, canActivate: [AuthService] },
    { path: 'photo', loadChildren: './photo/photo.module#PhotoModule' },
    { path: 'video', loadChildren: './video/video.module#VideoModule' },
    { path: 'user', loadChildren: './user/user.module#UserModule'},
/*    { path: 'photoAlbums', component: GalleryPhotoAlbumsComponent, canActivate: [AuthService] }, 
    { path: 'photoAlbums', children: [
        { path: '**', component: GalleryPhotoAlbumsComponent, canActivate: [AuthService]}
    ]},
    { path: 'photos', children: [
        { path: '**', component: GalleryPhotoPhotosComponent, canActivate: [AuthService]}
    ]},
    { path: 'videoAlbums', component: GalleryVideoAlbumsComponent, canActivate: [AuthService] },
    { path: 'videoAlbums', children: [
        { path: '**', component: GalleryVideoAlbumsComponent, canActivate: [AuthService]}
    ]},
    { path: 'videos', children: [
        { path: '**', component: GalleryVideoVideosComponent, canActivate: [AuthService]}
    ]},
    { path: 'video', children: [
        { path: '**', component: GalleryVideoVideoComponent, canActivate: [AuthService]}
    ]},
*/
    { path: 'downloads', component: DownloadsComponent, canActivate: [AuthService] },
    { path: 'downloads/:download', component: DownloadsComponent, canActivate: [AuthService] },
/*
    { path: 'changepass/:username/:token', component: ChangePasswordComponent },
    { path: 'manage', component: ManageUsersComponent, canActivate: [AuthService] },
    { path: 'login', component: LoginComponent },
*/
    { path: 'about', component: AboutComponent, canActivate: [AuthService] },
    { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ];

  @NgModule({
    imports: [ RouterModule.forRoot(routes/*, { enableTracing: true }*/) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}