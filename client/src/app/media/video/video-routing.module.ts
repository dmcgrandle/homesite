import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { VideosComponent } from './videos/videos.component';
import { VideoComponent } from './video/video.component';
import { AuthService } from '../../user/_services/auth.service';

const routes: Routes = [
  { path: 'albums', component: AlbumsComponent, canActivate: [AuthService] },
  { path: 'albums', children: [
      { path: '**', component: AlbumsComponent, canActivate: [AuthService]}
  ]},
  { path: 'videos', children: [
      { path: '**', component: VideosComponent, canActivate: [AuthService]}
  ]},
  { path: 'video', children: [
      { path: '**', component: VideoComponent, canActivate: [AuthService]}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
