import {
    Pipe,
    PipeTransform,
    OnDestroy,
    WrappedValue,
    ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription, BehaviorSubject, pipe, of } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UrlHelperService } from '../_services/url-helper.service';

@Pipe({
    name: 'secure',
    pure: false
})
export class SecurePipe implements PipeTransform, OnDestroy {
    private _latestValue: any = null;
    private _latestReturnedValue: any = null;
    private _subscription: Subscription = null;
    private _obj: Observable<any> = null;

    private previousUrl: string;
    private _result: BehaviorSubject<any> = new BehaviorSubject('');
    private result: Observable<any> = this._result.asObservable();
    private _internalSubscription: Subscription = null;

    constructor(
        private _ref: ChangeDetectorRef,
        private urlHelperService: UrlHelperService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnDestroy(): void {
        if (this._subscription) {
            this._dispose();
        }
    }

    transform(url: string): any {
        const obj = this.internalTransform(url);
        return this.asyncTrasnform(obj);
    }

    private internalTransform(url: string): Observable<any> {
        if (!url) {
            return this.result;
        }

        if (this.previousUrl !== url) {
            this.previousUrl = url;
            this._internalSubscription = this.urlHelperService.get(url).subscribe(m => {
                const sanitized = this.sanitizer.bypassSecurityTrustUrl(m);
                this._result.next(sanitized);
            });
        }

        return this.result;
    }

    private asyncTrasnform(obj: Observable<any>): any {
        if (!this._obj) {
            if (obj) {
                this._subscribe(obj);
            }
            this._latestReturnedValue = this._latestValue;
            return this._latestValue;
        }
        if (obj !== this._obj) {
            this._dispose();
            return this.asyncTrasnform(obj);
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        this._latestReturnedValue = this._latestValue;
        return WrappedValue.wrap(this._latestValue);
    }

    private _subscribe(obj: Observable<any>) {
        const _this = this;
        this._obj = obj;

        this._subscription = obj.subscribe({
            next: function(value) {
                return _this._updateLatestValue(obj, value);
            },
            error: (e: any) => {
                throw e;
            }
        });
    }

    private _dispose() {
        this._subscription.unsubscribe();
        if (this._internalSubscription) {
            this._internalSubscription.unsubscribe();
            this._internalSubscription = null;
        }
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
    }

    private _updateLatestValue(async: any, value: Object) {
        if (async === this._obj) {
            this._latestValue = value;
            this._ref.markForCheck();
        }
    }
}

// transform(value: any, args?: any): any {
//   return null;
// }
