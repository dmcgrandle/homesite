import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.auth.getToken();

        const newRequest = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(newRequest)
            .pipe(
                tap(
                    event => { // called on each HttpEvent
                        //            if (event instanceof HttpResponse) {
                        //              // Do something with the response object
                        //            }
                    },
                    error => { // called on any error
                        if (error.status === 401) {
                            console.log('Need to log in again ...');
                            this.router.navigate(['/login']);
                        } else {
                            console.log('Response Error!  Here is the error object:');
                            console.log(error);
                        }
                    }
                ),
                finalize(
                    () => { } // Called every time whether error or not.
                )
            ); // end pipe
    }

}
