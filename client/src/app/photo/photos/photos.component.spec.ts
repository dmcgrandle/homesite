import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatCardModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { SecurePipe } from '../../shared/_helpers/secure.pipe';
import { PhotosComponent } from './photos.component';

// describe('PhotosComponent', () => {
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
//     let component: PhotosComponent;
//     let fixture: ComponentFixture<PhotosComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [PhotosComponent, SecurePipe],
//             imports: [MatIconModule, MatCardModule, HttpClientModule, MatDialogModule],
//             providers: [
//                 { provide: Router, useValue: routerSpy },
//                 { provide: ActivatedRoute, useValue: routeSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PhotosComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
