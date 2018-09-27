import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatProgressSpinnerModule, MatDialogModule, /* MatFormFieldModule, MatPaginatorModule, 
MatIconModule, MatTableModule, MatProgressSpinnerModule */} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SecurePipe } from '../_helpers/secure.pipe';
import { GalleryPhotoAlbumsComponent } from './gallery-photo-albums.component';

describe('GalleryPhotoAlbumsListComponent', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const routeSpy = jasmine.createSpyObj('Route', {
        snapshot: {
            paramMap: {
                get() {
                    (t) => {
                        if (t === 'token') return 'ABCDEFGHIJKL';
                        if (t === 'username') return 'guest';
                    }
                }
            }
        }
    });
    let component: GalleryPhotoAlbumsComponent;
    let fixture: ComponentFixture<GalleryPhotoAlbumsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryPhotoAlbumsComponent, SecurePipe],
            imports: [MatCardModule, MatProgressSpinnerModule, MatDialogModule, HttpClientModule,
                      RouterTestingModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeSpy }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryPhotoAlbumsComponent);
        component = fixture.componentInstance;
//        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
