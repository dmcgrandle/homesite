import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';

import { MatCardModule, MatIconModule, MatProgressSpinnerModule
} from '@angular/material';
// import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
//     MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatPaginatorModule,
//     MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
//     MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule,
//     MatTableModule, MatSortModule, MatProgressBarModule, MatTabsModule, MatExpansionModule
// } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { PhotoRoutingModule } from './photo-routing.module';
import { AlbumsComponent } from './albums/albums.component';
import { PhotosComponent } from './photos/photos.component';

@NgModule({
    imports: [
        CommonModule,
        PhotoRoutingModule,
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
    declarations: [ AlbumsComponent, PhotosComponent ],
    providers: [
        {
            provide: OverlayContainer,
            useClass: FullscreenOverlayContainer
        },
    ]
})
export class PhotoModule { }