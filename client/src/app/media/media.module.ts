import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';
import { MediaRoutingModule } from './media-routing.module';
import { AlbumsComponent } from './albums/albums.component';

@NgModule({
    declarations: [AlbumsComponent],
    imports: [
        CommonModule,
        MediaRoutingModule,
        SharedModule,
        FlexLayoutModule,
        MatCardModule,
        MatProgressSpinnerModule,
    ]
})
export class MediaModule {}
