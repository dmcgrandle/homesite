import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import {
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SecurePipe } from './_helpers/secure.pipe';
import { EqualDirective } from './_helpers/equal-validator';
import { JwtInterceptor } from './_services/jwt-interceptor';
import { UrlHelperService } from './_services/url-helper.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AlertMessageDialogComponent } from './alert-message-dialog/alert-message-dialog.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardComponent } from './card/card.component';
import { MasonryGridDirective } from './masonry/masonry-grid.directive';
import { MasonryItemDirective } from './masonry/masonry-item.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FileDeleteComponent } from './file-delete/file-delete.component';
import { CopyToClipboardComponent } from './copy-to-clipboard/copy-to-clipboard.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FlexLayoutModule,
        MatCardModule,
        MatDialogModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatProgressBarModule
    ],
    exports: [
        CardComponent,
        CopyToClipboardComponent,
        PageNotFoundComponent,
        ProgressBarComponent,
        FileUploadComponent,
        FileDownloadComponent,
        FileDeleteComponent,
        SecurePipe,
        MasonryGridDirective,
        MasonryItemDirective
    ],
    declarations: [
        PageNotFoundComponent,
        AlertMessageDialogComponent,
        CopyToClipboardComponent,
        ProgressBarComponent,
        SecurePipe,
        EqualDirective,
        CardComponent,
        MasonryGridDirective,
        MasonryItemDirective,
        FileUploadComponent,
        FileDeleteComponent,
        FileDownloadComponent
    ],
    entryComponents: [AlertMessageDialogComponent, ProgressBarComponent]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [JwtInterceptor, UrlHelperService]
        };
    }
}
