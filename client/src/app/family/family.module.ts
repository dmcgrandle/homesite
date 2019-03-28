import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatTabsModule,
  MatExpansionModule,
} from '@angular/material';

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
    MatCardModule,
    MatTabsModule,
    MatExpansionModule
  ],
  declarations: [AboutComponent]
})
export class FamilyModule { }
