import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
//import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//for configuration file read during initialization:
import { APP_INITIALIZER } from '@angular/core';

//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatPaginatorModule,
  MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatListModule, MatGridListModule,
  MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule, 
  MatTableModule, MatSortModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { AlertMessageDialogComponent } from './alert-message-dialog/alert-message-dialog.component';
import { RegisterComponent } from './register/register.component';
import { EqualDirective } from './_helpers/equal-validator';
import { ForgotDialogComponent } from './forgot-dialog/forgot-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums/gallery-photo-albums.component';
import { GalleryPhotoPhotosComponent } from './gallery-photo-photos/gallery-photo-photos.component';
import { GalleryVideoAlbumsComponent } from './gallery-video-albums/gallery-video-albums.component';
import { GalleryVideoVideosComponent } from './gallery-video-videos/gallery-video-videos.component';
import { GalleryVideoVideoComponent } from './gallery-video-video/gallery-video-video.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';

import { MediaService } from './_services/media.service';
import { AuthService } from './_services/auth.service';
import { UrlHelperService } from './_services/url-helper.service';

import { JwtInterceptor } from './_helpers/jwt-interceptor';
import { SecurePipe } from './_helpers/secure.pipe';
import { DownloadProgressBarComponent } from './download-progress-bar/download-progress-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AlertMessageDialogComponent,
    RegisterComponent,
    EqualDirective,
    ForgotDialogComponent,
    ChangePasswordComponent,
    GalleryComponent,
    GalleryPhotoAlbumsComponent,
    GalleryPhotoPhotosComponent,
    GalleryVideoAlbumsComponent,
    GalleryVideoVideosComponent,
    GalleryVideoVideoComponent,
    PageNotFoundComponent,
    AboutComponent,
    DownloadsComponent,
    SecurePipe,
    ManageUsersComponent,
    EditUserDialogComponent,
    DownloadProgressBarComponent
  ],
  imports: [
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
    MatSortModule, MatProgressBarModule
  ],
  providers: [
    AppConfig, {
      provide: APP_INITIALIZER,
      useFactory: loadConfigDuringInit,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: OverlayContainer, 
      useClass: FullscreenOverlayContainer
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    RegisterComponent, ForgotDialogComponent, AlertMessageDialogComponent, 
    EditUserDialogComponent, DownloadProgressBarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfigDuringInit(appConfig: AppConfig) {
  return () => appConfig.load();
}
