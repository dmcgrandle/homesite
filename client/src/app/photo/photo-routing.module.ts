import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { PhotosComponent } from './photos/photos.component';
import { AuthService } from '../shared/_services/auth.service';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

const photoRoutes: Routes = [
  { path: 'albums', component: AlbumsComponent, canActivate: [AuthService] }, 
  { path: 'albums', children: [
      { path: '**', component: AlbumsComponent, canActivate: [AuthService]}
  ]},
  { path: 'photos', children: [
      { path: '**', component: PhotosComponent, canActivate: [AuthService]}
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(photoRoutes)],
  exports: [RouterModule]
})
export class PhotoRoutingModule { }
