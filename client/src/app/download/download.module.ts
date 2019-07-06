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
import { DownloadsComponent } from './downloads/downloads.component';
import { FilenameComponent } from './filename/filename.component';
import { GetFileComponent } from './get-file/get-file.component';

@NgModule({
    declarations: [
        DownloadsComponent,
        FilenameComponent,
        GetFileComponent
    ],
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
