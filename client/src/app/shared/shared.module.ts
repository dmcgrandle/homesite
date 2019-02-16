import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SecurePipe } from './_helpers/secure.pipe';
import { JwtInterceptor } from './_services/jwt-interceptor';
import { AuthService } from './_services/auth.service';
import { MediaService } from './_services/media.service';
import { UrlHelperService } from './_services/url-helper.service';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        PageNotFoundComponent,
        SecurePipe,
    ],
    declarations: [
        PageNotFoundComponent,
        SecurePipe,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [ JwtInterceptor, AuthService, MediaService, UrlHelperService ]
        }
    }
}
