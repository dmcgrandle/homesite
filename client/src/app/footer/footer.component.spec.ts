import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AppConfig } from '../app.config';
import { FooterComponent } from './footer.component';

// describe('FooterComponent', () => {
//     const configSpy = jasmine.createSpyObj({
//         const: {
//             header: {
//                 title: 'tHeader'
//             }
//         }
//     });
//     let component: FooterComponent;
//     let fixture: ComponentFixture<FooterComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [FooterComponent],
//             providers: [
//                 { provide: AppConfig, useValue: configSpy }
//             ],
//             imports: [HttpClientModule, RouterTestingModule]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(FooterComponent);
//         component = fixture.componentInstance;
// //        fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
