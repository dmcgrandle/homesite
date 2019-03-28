import { Component, Input, Output, EventEmitter, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { Photo } from '../_helpers/classes';

const ANIMATION_TIMINGS = '900ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
    selector: 'photo-focal',
    templateUrl: './focal-photo.component.html',
    styleUrls: ['./focal-photo.component.scss'],
    animations: [
        trigger('fade', [
            state('fadeOut', style({ opacity: 0 })),
            state('fadeIn', style({ opacity: 1 })),
            transition('* => fadeIn', animate(ANIMATION_TIMINGS))
        ])
    ]
})
export class FocalPhotoComponent implements AfterViewChecked {

    imageHeight: number;
    @Input() focal: Photo;
    @Input() loading: boolean;
    @Output() loaded = new EventEmitter<boolean>(false);
    @Output() clicked = new EventEmitter<boolean>(false);
    @ViewChild('imageContainer') imageContainerRef: ElementRef;

    ngAfterViewChecked() {
        // Setting this.imageHeight (which is used in the template to set the height of
        // the inner spinner) prevents the "flashing" effect when loading a new largeImage
        // due to the height difference between the previous image and the spinner.
        if (this.imageContainerRef && !this.loading) {
            this.imageHeight = this.imageContainerRef.nativeElement.clientHeight;
        }
    }
}
