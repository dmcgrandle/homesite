import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppConfig } from '../app.config';
import { SecurePipe } from '../_helpers/secure.pipe';
import { GalleryComponent } from './gallery.component';

// describe('GalleryComponent', () => {
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: GalleryComponent;
//     let fixture: ComponentFixture<GalleryComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [GalleryComponent, SecurePipe],
//             imports: [MatCardModule,  RouterTestingModule, HttpClientModule],
//             providers: [
//                 { provide: AppConfig, useValue: configSpy }
//             ]

//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GalleryComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
