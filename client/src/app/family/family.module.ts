import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatTabsModule, MatExpansionModule,
} from '@angular/material';
// import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
//     MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatPaginatorModule,
//     MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
//     MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule,
//     MatTableModule, MatSortModule, MatProgressBarModule, MatTabsModule, MatExpansionModule
// } from '@angular/material';

import { FamilyRoutingModule } from './family-routing.module';
import { AboutComponent } from './about/about.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FamilyRoutingModule,
    SharedModule,
    FlexLayoutModule,
    MatCardModule, MatTabsModule, MatExpansionModule
    // MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    // MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTableModule,
    // MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
    // , , , MatDialogModule,
    // MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule,
    // MatProgressBarModule, MatTabsModule, MatExpansionModule,
    // MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    // MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTableModule,
    // MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
  ],
  declarations: [AboutComponent]
})
export class FamilyModule { }
