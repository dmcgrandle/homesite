import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { KEY_CODE } from '../../shared/_classes/key-code-enum';

import { Photo } from '../_helpers/classes';

@Component({
    selector: 'photo-thumbnails',
    templateUrl: './thumbnails.component.html',
    styleUrls: ['./thumbnails.component.scss']
})
export class ThumbnailsComponent {

    @Input() thumbs: Photo[];
    @Input() curIndex: number;
    @Output() thumbChanged = new EventEmitter<number>();

    private changeThumb(newThumb: Photo) {
        if (newThumb !== this.thumbs[this.curIndex]) {
            const newIndex = this.thumbs.findIndex(photo => photo._id === newThumb._id);
            this.thumbChanged.emit(newIndex);
        }
    }

    private highlightAndScroll(thumb: Photo, thumbE: HTMLImageElement, thumbsE: Element) {
        // Only property we can scroll with is scrollLeft which is in PIXELS, so need
        // to calculate how many thumbs in the current window and where the center
        // is, then convert all that to pixels to calculate the amount to scroll.
        // Originally tried to use scrollIntoView, but that scrolled vertically as
        // well which messed up the screen depending on client browser window size.
        if (thumb._id === this.thumbs[this.curIndex]._id) {
            const thumbWidth = thumbE.scrollWidth + 6; // 6 is the border width
            const windowWidth = thumbsE.clientWidth; // visible thumbnails window
            const numThumbsDisplayed = windowWidth / thumbWidth - 1;
            const numThumbsToLeftOfCenter = this.curIndex - numThumbsDisplayed / 2;
            thumbsE.scrollLeft = numThumbsToLeftOfCenter * thumbWidth;
            // thumbE.scrollIntoView({behavior: "instant", block: "center", inline: "center"})
            return "selected"; // changes the id property of this element so css styles can outline it
        }
        return null;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.keyCode in KEY_CODE) {
            let nextIndex = 0;
            switch (event.keyCode) { // set nextIndex to where we are going next
                case KEY_CODE.RIGHT_ARROW:
                case KEY_CODE.DOWN_ARROW:
                    nextIndex = (this.curIndex === this.thumbs.length - 1) ? 0 : this.curIndex + 1;
                    break;
                case KEY_CODE.LEFT_ARROW:
                case KEY_CODE.UP_ARROW:
                    nextIndex = (this.curIndex === 0) ? this.thumbs.length - 1 : this.curIndex - 1;
                    break;
                case KEY_CODE.END:
                    nextIndex = this.thumbs.length - 1;
                    break;
                case KEY_CODE.HOME:
                    nextIndex = 0;
                    break;
                case KEY_CODE.PAGE_UP:
                    //            console.log('Pressed PAGE_UP');
                    break;
                case KEY_CODE.PAGE_DOWN:
                    //            console.log('Pressed PAGE_DOWN');
                    break;
            }
            this.thumbChanged.emit(nextIndex);
        }
    }

}
