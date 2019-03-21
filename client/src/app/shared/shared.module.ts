import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { 
    MatToolbarModule, 
    MatMenuModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressBarModule,
    MatCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SecurePipe } from './_helpers/secure.pipe';
import { EqualDirective } from './_helpers/equal-validator';
import { JwtInterceptor } from './_services/jwt-interceptor';
import { UrlHelperService } from './_services/url-helper.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AlertMessageDialogComponent } from './alert-message-dialog/alert-message-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardComponent } from './card/card.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FlexLayoutModule,
        MatCardModule,
        MatToolbarModule,
        MatMenuModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule
    ],
    exports: [
        CardComponent,
        PageNotFoundComponent,
        HeaderComponent,
        FooterComponent,
        ProgressBarComponent,
        SecurePipe,
    ],
    declarations: [
        PageNotFoundComponent,
        AlertMessageDialogComponent,
        HeaderComponent,
        FooterComponent,
        ProgressBarComponent,
        SecurePipe,
        EqualDirective,
        CardComponent
    ],
    entryComponents: [AlertMessageDialogComponent, ProgressBarComponent]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [ JwtInterceptor, UrlHelperService ]
        }
    }
}
