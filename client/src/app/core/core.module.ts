import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        SharedModule,
        FlexLayoutModule,
        MatCardModule
    ],
    declarations: [HomeComponent]
})
export class CoreModule { }
