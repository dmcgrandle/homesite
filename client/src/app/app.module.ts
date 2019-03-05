import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';//for conf file read during init
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { JwtInterceptor } from './shared/_services/jwt-interceptor';


@NgModule({
    declarations: [AppComponent],
    imports: [
        /* DownloadModule, */ // Lazy loaded
        /* PhotoModule, */ // Lazy loaded
        /* VideoModule, */ // Lazy loaded
        /* FamilyModule, */ // Lazy loaded
        CoreModule,
        UserModule.forRoot(), // not lazy loaded since all modules need logon and user info.
        SharedModule.forRoot(),
        AppRoutingModule,
        BrowserModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        HttpClientModule,
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfigDuringInit(appConfig: AppConfig) {
    return () => appConfig.load();
}
