import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

import { DownloadRoutingModule } from './download-routing.module';
// import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { FilenameComponent } from './filename/filename.component';

@NgModule({
    declarations: [DownloadsComponent, FilenameComponent],
    imports: [
        CommonModule,
        SharedModule,
        UserModule,
        FlexLayoutModule,
        DownloadRoutingModule,
        MatIconModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule
    ]
})
export class DownloadModule {}
