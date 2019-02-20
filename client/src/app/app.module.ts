import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//for configuration file read during initialization:
import { APP_INITIALIZER } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatPaginatorModule,
    MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule,
    MatTableModule, MatSortModule, MatProgressBarModule, MatTabsModule, MatExpansionModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GalleryComponent } from './gallery/gallery.component';

import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { JwtInterceptor } from './shared/_services/jwt-interceptor';

import { DownloadProgressBarComponent } from './download-progress-bar/download-progress-bar.component';


@NgModule({
    declarations: [
        AppComponent,
        GalleryComponent,
        AboutComponent,
        DownloadsComponent,
        DownloadProgressBarComponent
    ],
    imports: [
        /* PhotoModule, */ // Lazy loaded
        /* VideoModule, */ // Lazy loaded
        UserModule.forRoot(), // not lazy loaded since all modules need logon and user info.
        SharedModule.forRoot(),
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
        MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTableModule,
        MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
        MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule,
        FlexLayoutModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule,
        MatSortModule, MatProgressBarModule, MatTabsModule, MatExpansionModule
    ],
    providers: [
        AppConfig, {
            provide: APP_INITIALIZER,
            useFactory: loadConfigDuringInit,
            deps: [AppConfig],
            multi: true
        },
        // {
        //     provide: OverlayContainer,
        //     useClass: FullscreenOverlayContainer
        // },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    entryComponents: [DownloadProgressBarComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfigDuringInit(appConfig: AppConfig) {
    return () => appConfig.load();
}
