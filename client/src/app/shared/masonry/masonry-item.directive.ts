/* masonry-item.directive.ts
 * 
 * Sub-directive to create a masonry item in a masonry layout.  Reference:
 * https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
 *
 * Two directives are required for the masonry layout.  This one, MasonryItemDirective, is 
 * to apply to the grid item element.  Also needed is the companion MasonryGridDirective.
 *
 * This directive requires an Observable to be passed which is a stream of elements that
 * are ready to be updated.  Each directive will filter this stream to listen for it's
 * own element in the list and set the 'grid-row-end' span.  This directive also listens
 * for resize events since a new span value may need to be set when resizing.
 * 
 * One additional optional parameter can be set on the HTML element 'mnSpanColumns' which
 * can be 'true' if this directive should span 2 columns for landscape items, default
 * is 'false'.
 * 
*/
import { Directive, HostListener, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
    selector: '[mnMasonryItem]'
})
export class MasonryItemDirective implements OnInit, OnDestroy {

    @Input('mnMasonryItem') updateElement$: Subject<HTMLElement>;
    @Input() mnSpanColumns: string = "false";
    updateSub: Subscription;

    @HostListener('window:resize')
    screenResize() { this.setSpan(this.el.nativeElement); };

    constructor(public el: ElementRef) {}

    ngOnInit() {
        const myEl = this.el.nativeElement;
        this.updateSub = this.updateElement$.pipe(filter(el => el === myEl))
            .subscribe(el => this.setSpan(el));
    }

    ngOnDestroy() {
        if (this.updateSub) this.updateSub.unsubscribe();
    }

    setSpan(gridItem: HTMLElement) {
        const container = gridItem.parentElement;
        // let cardHeight = gridItem.getBoundingClientRect().height;
        // const cardWidth = gridItem.getBoundingClientRect().width;
        let cardHeight = gridItem.firstElementChild.getBoundingClientRect().height;
        const cardWidth = gridItem.firstElementChild.getBoundingClientRect().width;
        if ((this.mnSpanColumns === 'true') && (cardWidth > cardHeight)) {
            gridItem.style.setProperty('grid-column-end', 'span 2');
            // cardHeight = gridItem.getBoundingClientRect().height; // it changed...
            cardHeight = gridItem.firstElementChild.getBoundingClientRect().height; // it changed...
        }
        const rowGap = parseInt(getComputedStyle(container).getPropertyValue('grid-row-gap'));
        const rowHeight = parseInt(getComputedStyle(container).getPropertyValue('grid-auto-rows'));
        const itemsGutter = Math.ceil(rowGap ? 0 : (10 / rowHeight)); // add a 10px gutter if rowGap === 0
        const span = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap)) + itemsGutter;
        gridItem.style.setProperty('grid-row-end', `span ${span}`);
    }

}
