import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatTabsModule, MatExpansionModule, MatTabGroup } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AboutComponent } from './about.component';
import { AppConfig } from '../../app.config';

// Mock class
class MockAppConfig {
    const: Object = {
        about: {
            family : {
                name : 'Tests',
                members: [
                    {
                        position: 'Father',
                        firstName: 't1-firstName',
                        lastName: 't1-lastName',
                        avatar: 'assets/tests/lion.jpg',
                        photo: 'assets/tests/lion.jpg',
                        bio : [ 'test bio 1 line 1', 'line 2', 'line 3' ]
                    },
                    {
                        position: 'Mother',
                        firstName: 't2-firstName',
                        lastName: 't2-lastName',
                        avatar: 'assets/tests/lion.jpg',
                        photo: 'assets/tests/lion.jpg',
                        bio : [ 'test bio 2' ]
                    },
                ]
            }
        }
    }
}

xdescribe('Family Module: AboutComponent', () => {
    let aboutComponent: AboutComponent;
    let aboutElement: HTMLElement;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AboutComponent],
            providers: [{ provide: AppConfig, useClass: MockAppConfig }],
            imports: [BrowserAnimationsModule, MatCardModule, MatTabsModule, MatExpansionModule]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        aboutComponent = fixture.componentInstance;
        aboutElement = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be creatable', () => {
        expect(aboutComponent).toBeDefined();
    });

    it('should contain "Meet the Tests"', () => {
        expect(aboutElement.textContent).toContain('Meet the Tests');
    });

    it('should have two test family members displayed', () => {
        // Should be a mat-tab-label for each member displayed
        const memberTabs: NodeListOf<HTMLElement> = aboutElement.querySelectorAll('.mat-tab-label');
        expect(memberTabs.length).toBe(2);
    });

    it('should display the second member when the second label is clicked', () => {
        let tabComponent: MatTabGroup = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;
        const secondMemberTab: HTMLElement = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1].nativeElement;
        expect(tabComponent.selectedIndex).toBe(0); // Initially display first member
        secondMemberTab.click(); // Click to second member
        fixture.detectChanges();
        expect(tabComponent.selectedIndex).toBe(1);
    });
});
