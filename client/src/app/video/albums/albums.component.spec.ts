import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SecurePipe } from '../../shared/_helpers/secure.pipe';
import { AlbumsComponent } from './albums.component';

// describe('Video Module: AlbumsComponent', () => {
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
//     let component: GalleryVideoAlbumsComponent;
//     let fixture: ComponentFixture<GalleryVideoAlbumsComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [GalleryVideoAlbumsComponent, SecurePipe],
//             imports: [HttpClientModule, MatCardModule, MatProgressSpinnerModule, MatDialogModule, RouterTestingModule],
//             providers: [
//                 { provide: Router, useValue: routerSpy },
//                 { provide: ActivatedRoute, useValue: routeSpy }
//             ]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GalleryVideoAlbumsComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
