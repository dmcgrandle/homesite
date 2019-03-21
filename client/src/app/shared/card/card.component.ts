import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'shared-card',
    template: `
    <mat-card>
        <mat-card-header>
            <mat-card-title>
                <h3 class="card-title">{{name}}</h3>
            </mat-card-title>
            <mat-card-subtitle>{{description}}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]='image | secure' (load)="loaded.emit(true)">
    </mat-card>`,
    styles: [`
    .mat-card {
        background-color: #eaf6fd;
    }
    .card-title {
        font-size: 0.8em;
        margin: 0;
    }
    .mat-card-image {
        border-radius: 3px;
    }`]
})
export class CardComponent {

    @Input() name: string;
    @Input() description: string;
    @Input() image: string;
    @Output() loaded = new EventEmitter<boolean>(false);

}
