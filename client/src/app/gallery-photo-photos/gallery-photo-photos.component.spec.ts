import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatCardModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { SecurePipe } from '../_helpers/secure.pipe';
import { GalleryPhotoPhotosComponent } from './gallery-photo-photos.component';

// describe('GalleryPhotoPhotosComponent', () => {
//     const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
//     const routeSpy = jasmine.createSpyObj('Route', {
//         snapshot: {
//             paramMap: {
//                 get() {
//                     (t) => {
//                         if (t === 'token') return 'ABCDEFGHIJKL';
//                         if (t === 'username') return 'guest';
//                     }
//                 }
//             }
//         }
//     });
//     let component: GalleryPhotoPhotosComponent;
//     let fixture: ComponentFixture<GalleryPhotoPhotosComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [GalleryPhotoPhotosComponent, SecurePipe],
//             imports: [MatIconModule, MatCardModule, HttpClientModule, MatDialogModule],
//             providers: [
//                 { provide: Router, useValue: routerSpy },
//                 { provide: ActivatedRoute, useValue: routeSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GalleryPhotoPhotosComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
