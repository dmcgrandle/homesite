import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../../shared/shared.module';
import { VideoRoutingModule } from './video-routing.module';
import { VideosComponent } from './videos/videos.component';
import { VideoComponent } from './video/video.component';
import { AlbumsComponent } from './albums/albums.component';

@NgModule({
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  declarations: [ VideosComponent, VideoComponent, AlbumsComponent ]
})
export class VideoModule { }
