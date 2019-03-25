/* masonry-grid.directive.ts
 * 
 * Directive for a masonry grid container in a CSS grid masonry layout.  Reference:
 * https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb 
 *
 * Two directives are required for the masonry layout.  This MasonryGridDirectvie to
 * apply to the grid container element, and MasonryItemDirective to apply to the grid
 * item element.
 *  
 * This directive basically sets up CSS grid as in the following example format:
 * 
 *  .grid-container {
 *      display: grid;
 *      grid-row-gap: 10px;
 *      grid-column-gap: 1em;
 *      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
 *      grid-auto-rows: 5px;
 *      grid-auto-flow: row dense;
 *      overflow-y: auto;
 *  }
 * 
 * Optional inputs will change the defaults above.  Additional optional input 'mnSpanColumns'
 * should be true if landscape items should take up two columns instead of one.
 * 
 * Example usage:
 * 
 *  <div mnMasonryGrid>
 *      <div #imageItem [mnMasonryItem]="imgLoaded" mnSpanColumns="true" *ngFor="let photo of photos">
 *          <img [src]="photo.path" (loaded)="imgLoaded.next(imageItem)">
 *      </div>
 *  </div>
 * 
 * Note: masonry-item assumes there is only one direct child, so if you want an image with a caption for
 * example, you will need a containing div.  Something like this:
 * 
 *  <div mnMasonryGrid>
 *      <div #imageItem [mnMasonryItem]="imgLoaded" mnSpanColumns="true" *ngFor="let photo of photos">
 *          <div class="photo-wrapper">
 *              <img [src]="photo.path" (loaded)="imgLoaded.next(imageItem)">
 *              <h4>{{photo.caption}}</h4>
 *          </div>
 *      </div>
 *  </div>
 * 
*/

import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[mnMasonryGrid]'
})
export class MasonryGridDirective implements OnInit {

    // TODO: make default values configurable somehow...
    @Input() mnRowGap : string = '10px';
    @Input() mnColumnGap : string = '1em';
    @Input() mnMinColSize : string = '250px';
    @Input() mnAutoRows : string = '5px';
    @Input() mnAutoFlow : string = 'row dense';

    constructor(public el: ElementRef) {}

    ngOnInit() {
        this.el.nativeElement.style.display = 'grid';
        this.el.nativeElement.style.gridRowGap = this.mnRowGap;
        this.el.nativeElement.style.gridColumnGap = this.mnColumnGap;
        const gridTemplateColums = `repeat(auto-fill, minmax(${this.mnMinColSize}, 1fr))`;
        this.el.nativeElement.style.gridTemplateColumns = gridTemplateColums;
        this.el.nativeElement.style.gridAutoRows = this.mnAutoRows;
        this.el.nativeElement.style.gridAutoFlow = this.mnAutoFlow;
        this.el.nativeElement.style.overflowY = 'auto';
    }
}
