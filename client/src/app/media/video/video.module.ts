import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatIconModule, MatProgressSpinnerModule
} from '@angular/material';
// import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
//     MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatPaginatorModule,
//     MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
//     MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule,
//     MatTableModule, MatSortModule, MatProgressBarModule, MatTabsModule, MatExpansionModule
// } from '@angular/material';
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
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    // MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    // MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTableModule,
    // MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
    // , , , MatDialogModule,
    // MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule,
    // MatProgressBarModule, MatTabsModule, MatExpansionModule,
    // MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    // MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTableModule,
    // MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
    // MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule,
    // MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule,
    // MatProgressBarModule, MatTabsModule, MatExpansionModule
  ],
  declarations: [ VideosComponent, VideoComponent, AlbumsComponent ]
})
export class VideoModule { }
