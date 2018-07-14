import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//for configuration file read during initialization:
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
  MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
  MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatMenuModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AlertMessageDialogComponent } from './alert-message-dialog/alert-message-dialog.component';
import { RegisterComponent } from './register/register.component';
import { ForgotDialogComponent } from './forgot-dialog/forgot-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryVideoAlbumListComponent } from './gallery-video-albums-list/gallery-video-albums-list.component';
import { GalleryPhotoAlbumsListComponent } from './gallery-photo-albums-list/gallery-photo-albums-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';

import { AuthService } from './_services/auth.service';
import { UrlHelperService } from './_services/url-helper.service';

import { JwtInterceptor } from './_helpers/jwt-interceptor';
import { SecurePipe } from './_helpers/secure.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AlertMessageDialogComponent,
    RegisterComponent,
    ForgotDialogComponent,
    ChangePasswordComponent,
    GalleryComponent,
    GalleryVideoAlbumListComponent,
    GalleryPhotoAlbumsListComponent,
    PageNotFoundComponent,
    AboutComponent,
    DownloadsComponent,
    SecurePipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule,
    MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule,
    FlexLayoutModule, MatMenuModule
  ],
  providers: [
    AppConfig, {
      provide: APP_INITIALIZER,
      useFactory: loadConfigDuringInit,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  }],
  entryComponents: [
    RegisterComponent, ForgotDialogComponent, AlertMessageDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfigDuringInit(appConfig: AppConfig) {
  return () => appConfig.load();
}
