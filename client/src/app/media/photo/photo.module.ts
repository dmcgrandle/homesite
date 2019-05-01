import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import {
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MediaModule } from 'media/media.module';
import { SharedModule } from '../../shared/shared.module';

import { PhotoRoutingModule } from './photo-routing.module';
// import { AlbumsComponent } from './albums/albums.component';
import { PhotosComponent } from './photos/photos.component';
import { ThumbnailsComponent } from './thumbnails/thumbnails.component';
import { FocalPhotoComponent } from './focal-photo/focal-photo.component';

@NgModule({
    declarations: [
        // AlbumsComponent,
        PhotosComponent,
        ThumbnailsComponent,
        FocalPhotoComponent
    ],
    imports: [
        CommonModule,
        PhotoRoutingModule,
        MediaModule,
        SharedModule,
        FlexLayoutModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    providers: [
        {
            provide: OverlayContainer,
            useClass: FullscreenOverlayContainer
        }
    ]
})
export class PhotoModule {}
