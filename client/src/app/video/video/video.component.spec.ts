import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material';

import { SecurePipe } from '../../shared/_helpers/secure.pipe';
import { VideoComponent } from './video.component';

// describe('GalleryVideoVideoComponent', () => {
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
//     let component: GalleryVideoVideoComponent;
//     let fixture: ComponentFixture<GalleryVideoVideoComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [GalleryVideoVideoComponent, SecurePipe],
//             imports: [HttpClientModule, MatDialogModule],
//             providers: [
//                 { provide: Router, useValue: routerSpy },
//                 { provide: ActivatedRoute, useValue: routeSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GalleryVideoVideoComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
