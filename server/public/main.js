(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_classes/photo-classes.ts":
/*!*******************************************!*\
  !*** ./src/app/_classes/photo-classes.ts ***!
  \*******************************************/
/*! exports provided: Album, Photo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Album", function() { return Album; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Photo", function() { return Photo; });
// photo-classes.ts - Declaration of Photo and Album classes
var Album = /** @class */ (function () {
    function Album() {
        /*  this._id = 0;
          this.name = '';
          this.path = '';
          this.description = '';
          this.featuredPhoto = {
            filename : '',
            caption: ''
          }
          this.photos = [];
          this.albums = []; */
    }
    return Album;
}());

;
var Photo = /** @class */ (function () {
    function Photo() {
    }
    return Photo;
}());



/***/ }),

/***/ "./src/app/_helpers/jwt-interceptor.ts":
/*!*********************************************!*\
  !*** ./src/app/_helpers/jwt-interceptor.ts ***!
  \*********************************************/
/*! exports provided: JwtInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return JwtInterceptor; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var JwtInterceptor = /** @class */ (function () {
    function JwtInterceptor(auth) {
        this.auth = auth;
    }
    JwtInterceptor.prototype.intercept = function (request, next) {
        var token = this.auth.getToken();
        var newRequest = request.clone({
            headers: request.headers.set('Authorization', "Bearer " + token)
        });
        return next.handle(newRequest);
    };
    JwtInterceptor = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"]])
    ], JwtInterceptor);
    return JwtInterceptor;
}());



/***/ }),

/***/ "./src/app/_helpers/secure.pipe.ts":
/*!*****************************************!*\
  !*** ./src/app/_helpers/secure.pipe.ts ***!
  \*****************************************/
/*! exports provided: SecurePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecurePipe", function() { return SecurePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _services_url_helper_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/url-helper.service */ "./src/app/_services/url-helper.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SecurePipe = /** @class */ (function () {
    function SecurePipe(_ref, urlHelperService, sanitizer) {
        this._ref = _ref;
        this.urlHelperService = urlHelperService;
        this.sanitizer = sanitizer;
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
        this._result = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]('');
        this.result = this._result.asObservable();
        this._internalSubscription = null;
    }
    SecurePipe.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._dispose();
        }
    };
    SecurePipe.prototype.transform = function (url) {
        var obj = this.internalTransform(url);
        return this.asyncTrasnform(obj);
    };
    SecurePipe.prototype.internalTransform = function (url) {
        var _this = this;
        if (!url) {
            return this.result;
        }
        if (this.previousUrl !== url) {
            this.previousUrl = url;
            this._internalSubscription = this.urlHelperService.get(url).subscribe(function (m) {
                var sanitized = _this.sanitizer.bypassSecurityTrustUrl(m);
                _this._result.next(sanitized);
            });
        }
        return this.result;
    };
    SecurePipe.prototype.asyncTrasnform = function (obj) {
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
        return _angular_core__WEBPACK_IMPORTED_MODULE_0__["WrappedValue"].wrap(this._latestValue);
    };
    SecurePipe.prototype._subscribe = function (obj) {
        var _this = this;
        this._obj = obj;
        this._subscription = obj.subscribe({
            next: function (value) {
                return _this._updateLatestValue(obj, value);
            }, error: function (e) { throw e; }
        });
    };
    SecurePipe.prototype._dispose = function () {
        this._subscription.unsubscribe();
        this._internalSubscription.unsubscribe();
        this._internalSubscription = null;
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
    };
    SecurePipe.prototype._updateLatestValue = function (async, value) {
        if (async === this._obj) {
            this._latestValue = value;
            this._ref.markForCheck();
        }
    };
    SecurePipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({
            name: 'secure',
            pure: false
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _services_url_helper_service__WEBPACK_IMPORTED_MODULE_3__["UrlHelperService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]])
    ], SecurePipe);
    return SecurePipe;
}());

// transform(value: any, args?: any): any {
//   return null;
// }


/***/ }),

/***/ "./src/app/_services/auth.service.ts":
/*!*******************************************!*\
  !*** ./src/app/_services/auth.service.ts ***!
  \*******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
        this._authenticated = false;
        //  private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
        this.user = {};
        // set up default starting values
        localStorage.setItem('userId', "-1"); //no user logged in to start with
    }
    AuthService.prototype.isAuthenticated = function () {
        //    return this._authenticated.value;
        return this._authenticated;
    };
    AuthService.prototype.setAuthenticated = function (value) {
        //    this._authenticated.next(value);
        this._authenticated = value;
    };
    AuthService.prototype.authLogin = function () {
        var _this = this;
        return this.http.post('/api/users/login', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (res) { return _this.storeUserResponse(res); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function () { return _this.setAuthenticated(true); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authRegister = function () {
        return this.http.post('/api/users/create', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authForgot = function () {
        return this.http.post('/api/users/forgot', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authChangePassword = function (token) {
        var body = this.user; // http body to send will be the user and the token
        body['token'] = token;
        return this.http.post('/api/users/changepassword', body).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.getToken = function () {
        return localStorage.getItem('jwtToken');
    };
    AuthService.prototype.isLoginExpired = function () {
        var tokenTimeRemaining = Number(localStorage.getItem('expiresAt')) - Math.round(Date.now() / 1000);
        return (tokenTimeRemaining < 300); // If less than 5 mins (300s) remaining, log in again.
    };
    AuthService.prototype.hasLoggedInBefore = function () {
        return (localStorage.getItem('successfulLogin') === 'true');
    };
    AuthService.prototype.lastLoggedInUsername = function () {
        return localStorage.getItem('username');
    };
    AuthService.prototype.lastLoggedInUserLevel = function () {
        return localStorage.getItem('level');
    };
    AuthService.prototype.getAlbum = function (id) {
        return this.http.get('/api/photos/album/' + id);
    };
    AuthService.prototype.getAlbums = function (albums) {
        var albumString = '(' + albums.join('+') + ')';
        return this.http.get('/api/photos/albums/' + albumString);
    };
    AuthService.prototype.authLogout = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('level');
        localStorage.removeItem('expiresAt');
        this.setAuthenticated(false);
        this.user = {};
    };
    AuthService.prototype.storeUserResponse = function (res) {
        localStorage.setItem('username', this.user['username']);
        localStorage.setItem('jwtToken', res.jwtToken);
        localStorage.setItem('level', res.level);
        localStorage.setItem('expiresAt', res.expiresAt);
        localStorage.setItem('successfulLogin', 'true');
        /*  console.log('userId: ' + localStorage.getItem('userId'));
            console.log('jwtToken: ' + localStorage.getItem('jwtToken'));
            console.log('level: ' + localStorage.getItem('level'));
            console.log('expiresAt: ' + localStorage.getItem('expiresAt')); */
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/_services/url-helper.service.ts":
/*!*************************************************!*\
  !*** ./src/app/_services/url-helper.service.ts ***!
  \*************************************************/
/*! exports provided: UrlHelperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlHelperService", function() { return UrlHelperService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UrlHelperService = /** @class */ (function () {
    function UrlHelperService(http) {
        this.http = http;
    }
    UrlHelperService.prototype.get = function (url) {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (observer) {
            var objectUrl = null;
            _this.http.get(url, { responseType: 'blob' })
                .subscribe(function (m) {
                objectUrl = URL.createObjectURL(m);
                observer.next(objectUrl);
            });
            return function () {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
        });
    };
    UrlHelperService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], UrlHelperService);
    return UrlHelperService;
}());



/***/ }),

/***/ "./src/app/about/about.component.html":
/*!********************************************!*\
  !*** ./src/app/about/about.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  about works!\n</p>\n"

/***/ }),

/***/ "./src/app/about/about.component.scss":
/*!********************************************!*\
  !*** ./src/app/about/about.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/about/about.component.ts":
/*!******************************************!*\
  !*** ./src/app/about/about.component.ts ***!
  \******************************************/
/*! exports provided: AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return AboutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AboutComponent = /** @class */ (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-about',
            template: __webpack_require__(/*! ./about.component.html */ "./src/app/about/about.component.html"),
            styles: [__webpack_require__(/*! ./about.component.scss */ "./src/app/about/about.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "./src/app/alert-message-dialog/alert-message-dialog.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/alert-message-dialog/alert-message-dialog.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"alert-message-container\" fxLayoutAlign=\"center center\">\n  <div fxLayout=\"column\">\n    <mat-toolbar class=\"toolbar\" align=\"center\">\n      <h3 >Note</h3>\n    </mat-toolbar>\n    <div mat-dialog-content>\n      <p>{{data.alertMessage}}</p>\n    </div>\n    <div mat-dialog-actions>\n      <!-- <button mat-raised-button color=\"secondary\" mat-dialog-close>Cancel</button> -->\n      <span class=\"fill-space\"></span>\n      <button mat-raised-button type=\"submit\" (click)=\"onOkClick()\" color=\"primary\" cdkFocusInitial>Ok</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/alert-message-dialog/alert-message-dialog.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/alert-message-dialog/alert-message-dialog.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".alert-message-container {\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px 10px 22px 10px; }\n\nh3 {\n  font-size: 25px;\n  flex: 1 1 auto; }\n"

/***/ }),

/***/ "./src/app/alert-message-dialog/alert-message-dialog.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/alert-message-dialog/alert-message-dialog.component.ts ***!
  \************************************************************************/
/*! exports provided: AlertMessageDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertMessageDialogComponent", function() { return AlertMessageDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var AlertMessageDialogComponent = /** @class */ (function () {
    function AlertMessageDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    AlertMessageDialogComponent.prototype.ngOnInit = function () {
    };
    AlertMessageDialogComponent.prototype.onOkClick = function () {
        this.dialogRef.close();
    };
    AlertMessageDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-alert-message-dialog',
            template: __webpack_require__(/*! ./alert-message-dialog.component.html */ "./src/app/alert-message-dialog/alert-message-dialog.component.html"),
            styles: [__webpack_require__(/*! ./alert-message-dialog.component.scss */ "./src/app/alert-message-dialog/alert-message-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], AlertMessageDialogComponent);
    return AlertMessageDialogComponent;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <app-login></app-login> -->\n<app-header></app-header>\n<router-outlet></router-outlet>\n<app-footer></app-footer>\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'McGrandle.com';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.config.ts":
/*!*******************************!*\
  !*** ./src/app/app.config.ts ***!
  \*******************************/
/*! exports provided: AppConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppConfig", function() { return AppConfig; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppConfig = /** @class */ (function () {
    function AppConfig(http) {
        this.http = http;
        this.settings = {};
    }
    AppConfig.prototype.load = function () {
        var _this = this;
        var jsonFile = "assets/config/config." + _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].confName + ".json";
        return new Promise(function (resolve, reject) {
            _this.http.get(jsonFile).subscribe(function (res) {
                _this.settings = res;
                resolve();
            }, function (err) { return reject('Could not load file ' + jsonFile + ': ' + JSON.stringify(err)); });
        });
    };
    AppConfig = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], AppConfig);
    return AppConfig;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule, loadConfigDuringInit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadConfigDuringInit", function() { return loadConfigDuringInit; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.config */ "./src/app/app.config.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/footer/footer.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./forgot-dialog/forgot-dialog.component */ "./src/app/forgot-dialog/forgot-dialog.component.ts");
/* harmony import */ var _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./change-password/change-password.component */ "./src/app/change-password/change-password.component.ts");
/* harmony import */ var _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./gallery/gallery.component */ "./src/app/gallery/gallery.component.ts");
/* harmony import */ var _gallery_video_albums_list_gallery_video_albums_list_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./gallery-video-albums-list/gallery-video-albums-list.component */ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.ts");
/* harmony import */ var _gallery_photo_albums_list_gallery_photo_albums_list_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./gallery-photo-albums-list/gallery-photo-albums-list.component */ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");
/* harmony import */ var _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./downloads/downloads.component */ "./src/app/downloads/downloads.component.ts");
/* harmony import */ var _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./_helpers/jwt-interceptor */ "./src/app/_helpers/jwt-interceptor.ts");
/* harmony import */ var _helpers_secure_pipe__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./_helpers/secure.pipe */ "./src/app/_helpers/secure.pipe.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






//for configuration file read during initialization:






















var appRoutes = [
    { path: 'gallery', component: _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_18__["GalleryComponent"] },
    { path: 'videos', component: _gallery_video_albums_list_gallery_video_albums_list_component__WEBPACK_IMPORTED_MODULE_19__["GalleryVideoAlbumListComponent"] },
    { path: 'photo-albums', component: _gallery_photo_albums_list_gallery_photo_albums_list_component__WEBPACK_IMPORTED_MODULE_20__["GalleryPhotoAlbumsListComponent"] },
    { path: 'downloads', component: _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_23__["DownloadsComponent"] },
    { path: 'changepass/:username/:token', component: _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_17__["ChangePasswordComponent"] },
    { path: 'about', component: _about_about_component__WEBPACK_IMPORTED_MODULE_22__["AboutComponent"] },
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_13__["LoginComponent"] },
    { path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { path: '**', component: _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_21__["PageNotFoundComponent"] }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"],
                _header_header_component__WEBPACK_IMPORTED_MODULE_11__["HeaderComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_13__["LoginComponent"],
                _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_14__["AlertMessageDialogComponent"],
                _register_register_component__WEBPACK_IMPORTED_MODULE_15__["RegisterComponent"],
                _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_16__["ForgotDialogComponent"],
                _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_17__["ChangePasswordComponent"],
                _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_18__["GalleryComponent"],
                _gallery_video_albums_list_gallery_video_albums_list_component__WEBPACK_IMPORTED_MODULE_19__["GalleryVideoAlbumListComponent"],
                _gallery_photo_albums_list_gallery_photo_albums_list_component__WEBPACK_IMPORTED_MODULE_20__["GalleryPhotoAlbumsListComponent"],
                _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_21__["PageNotFoundComponent"],
                _about_about_component__WEBPACK_IMPORTED_MODULE_22__["AboutComponent"],
                _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_23__["DownloadsComponent"],
                _helpers_secure_pipe__WEBPACK_IMPORTED_MODULE_25__["SecurePipe"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forRoot(appRoutes
                //      { enableTracing: true } // <-- debugging purposes only
                ),
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatButtonModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatCheckboxModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatDatepickerModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatInputModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatRadioModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatSelectModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatSlideToggleModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatToolbarModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatListModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatCardModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatIconModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatProgressSpinnerModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatDialogModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__["FlexLayoutModule"], _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"]
            ],
            providers: [
                _app_config__WEBPACK_IMPORTED_MODULE_5__["AppConfig"], {
                    provide: _angular_core__WEBPACK_IMPORTED_MODULE_1__["APP_INITIALIZER"],
                    useFactory: loadConfigDuringInit,
                    deps: [_app_config__WEBPACK_IMPORTED_MODULE_5__["AppConfig"]],
                    multi: true
                },
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"],
                    useClass: _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_24__["JwtInterceptor"],
                    multi: true
                }
            ],
            entryComponents: [
                _register_register_component__WEBPACK_IMPORTED_MODULE_15__["RegisterComponent"], _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_16__["ForgotDialogComponent"], _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_14__["AlertMessageDialogComponent"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());

function loadConfigDuringInit(appConfig) {
    return function () { return appConfig.load(); };
}


/***/ }),

/***/ "./src/app/change-password/change-password.component.html":
/*!****************************************************************!*\
  !*** ./src/app/change-password/change-password.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!auth.isAuthenticated()\">\n  <!-- <video autoplay muted loop id=\"BackImage\">\n    <source src=\"assets/video/Piano480p.mp4\" type=\"video/mp4\">\n  </video> -->\n  <img src=\"assets/images/Mountain.jpg\" id=\"BackImage\" fxFlexFill>\n  <div class=\"change-password-container\" fxLayoutAlign=\"center center\">\n        <!-- fxLayout=\"row\"\n        fxLayout.sm=\"column\"\n        fxLayout.xs=\"column\" -->\n      <form novalidate #changePasswordForm=\"ngForm\" class=\"change-password-form\" fxLayout=\"column\">\n        <mat-toolbar class=\"toolbar\">\n          <h3 align=\"center\">Change your password</h3>\n        </mat-toolbar>\n        <p>Changing password for user: {{ auth.user.username }}</p>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"Password\" [type]=\"hidePassword ? 'password' : 'text'\"\n            [(ngModel)]=\"auth.user.password\" #password=\"ngModel\" name=\"password\" required>\n          <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n          <mat-icon matSuffix (click)=\"hidePassword = !hidePassword\">{{hidePassword ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"password.pristine\">\n              <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"Re-Enter your password\" [type]=\"hidePassCheck ? 'password' : 'text'\"\n             [(ngModel)]=\"auth.user.passcheck\"\n             name=\"passcheck\" #passcheck=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hidePassCheck = !hidePassCheck\">{{hidePassCheck ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"passcheck.pristine\">\n              <span [hidden]=\"!passcheck.errors?.required\">** Password Check is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <div fxLayout=\"row\">\n          <span class=\"fill-space\"></span>\n          <button mat-raised-button type=\"submit\"\n             color=\"primary\" [disabled]=\"(auth.user.password != auth.user.passcheck)\" (click)=\"onChangePassword()\">Change Password</button>\n        </div>\n      </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/change-password/change-password.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/change-password/change-password.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#BackImage {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-filter: opacity(60%);\n          filter: opacity(60%);\n  z-index: -1;\n  background-position: right;\n  background-size: cover; }\n\n.change-password-container {\n  min-height: 100vh; }\n\n.change-password-form {\n  min-width: 300px;\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px; }\n"

/***/ }),

/***/ "./src/app/change-password/change-password.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/change-password/change-password.component.ts ***!
  \**************************************************************/
/*! exports provided: ChangePasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangePasswordComponent", function() { return ChangePasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ChangePasswordComponent = /** @class */ (function () {
    function ChangePasswordComponent(auth, route, router, dialog) {
        this.auth = auth;
        this.route = route;
        this.router = router;
        this.dialog = dialog;
        this.hidePassword = true;
        this.hidePassCheck = true;
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        this.auth.user = {}; // first clear out any old user info
        this.auth.user['username'] = this.route.snapshot.paramMap.get('username');
        this.token = this.route.snapshot.paramMap.get('token');
    };
    ChangePasswordComponent.prototype.onChangePassword = function () {
        var _this = this;
        this.auth.authChangePassword(this.token).subscribe(function (result) {
            _this.alertMessage = 'Password changed for "' + _this.auth.user['username'] + '"';
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertMessageDialogComponent"], {
                data: { alertMessage: _this.alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
            console.log("Password changed for user: " + _this.auth.user['username']);
            _this.router.navigate(['/login']);
        }, function (err) { return console.log(err); }, function () { });
    };
    ChangePasswordComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-change-password',
            template: __webpack_require__(/*! ./change-password.component.html */ "./src/app/change-password/change-password.component.html"),
            styles: [__webpack_require__(/*! ./change-password.component.scss */ "./src/app/change-password/change-password.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]])
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());



/***/ }),

/***/ "./src/app/downloads/downloads.component.html":
/*!****************************************************!*\
  !*** ./src/app/downloads/downloads.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  downloads not yet implemented!\n</p>\n"

/***/ }),

/***/ "./src/app/downloads/downloads.component.scss":
/*!****************************************************!*\
  !*** ./src/app/downloads/downloads.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/downloads/downloads.component.ts":
/*!**************************************************!*\
  !*** ./src/app/downloads/downloads.component.ts ***!
  \**************************************************/
/*! exports provided: DownloadsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadsComponent", function() { return DownloadsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DownloadsComponent = /** @class */ (function () {
    function DownloadsComponent() {
    }
    DownloadsComponent.prototype.ngOnInit = function () {
    };
    DownloadsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-downloads',
            template: __webpack_require__(/*! ./downloads.component.html */ "./src/app/downloads/downloads.component.html"),
            styles: [__webpack_require__(/*! ./downloads.component.scss */ "./src/app/downloads/downloads.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], DownloadsComponent);
    return DownloadsComponent;
}());



/***/ }),

/***/ "./src/app/footer/footer.component.html":
/*!**********************************************!*\
  !*** ./src/app/footer/footer.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <mat-toolbar class=\"toolbar\" fxLayout=\"column\" fxLayoutGap=\"0px\" fxLayoutAlign=\"center center\">\n      <h2>{{CFG.settings.footer.title}}</h2>\n      <p>Contact <a href=\"mailto:{{CFG.settings.footer.email}}\">{{CFG.settings.footer.email}}</a> with any issues.</p>\n  </mat-toolbar>\n</div>\n"

/***/ }),

/***/ "./src/app/footer/footer.component.scss":
/*!**********************************************!*\
  !*** ./src/app/footer/footer.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p {\n  font-size: 12px;\n  margin: -5px 0 0 0; }\n"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app.config */ "./src/app/app.config.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FooterComponent = /** @class */ (function () {
    function FooterComponent(auth, CFG) {
        this.auth = auth;
        this.CFG = CFG;
    }
    FooterComponent.prototype.ngOnInit = function () { };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! ./footer.component.html */ "./src/app/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.scss */ "./src/app/footer/footer.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"],
            _app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"]])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/forgot-dialog/forgot-dialog.component.html":
/*!************************************************************!*\
  !*** ./src/app/forgot-dialog/forgot-dialog.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"register-container\" fxLayoutAlign=\"center center\">\n      <!-- fxLayout=\"row\"\n      fxLayout.sm=\"column\"\n      fxLayout.xs=\"column\" -->\n    <form novalidate #forgotDialogForm=\"ngForm\" class=\"forgot-dialog-form\" fxLayout=\"column\" (ngSubmit)=\"onSubmitClick()\">\n      <mat-toolbar class=\"toolbar\">\n        <h3 align=\"center\">Forgot username/password</h3>\n      </mat-toolbar>\n        <p>Whether you forgot your username OR your password, simply input your email address\n           below and an email will be sent to you with your username and a link to reset\n           your password.</p>\n      <mat-form-field>\n        <input matInput maxlength=\"40\" placeholder=\"Email\" type=\"email\" [(ngModel)]=\"auth.user.email\" #email=\"ngModel\" name=\"email\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"email.pristine\">\n            <span [hidden]=\"!email.errors?.required\">** email is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <div fxLayout=\"row\">\n        <button mat-button mat-dialog-close>Cancel</button>\n        <span class=\"fill-space\"></span>\n        <button mat-raised-button routerLink=\"/login\" routerLinkActive=\"active\" type=\"submit\" color=\"primary\" [disabled]=\"forgotDialogForm.form.invalid\">Submit</button>\n      </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "./src/app/forgot-dialog/forgot-dialog.component.scss":
/*!************************************************************!*\
  !*** ./src/app/forgot-dialog/forgot-dialog.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".forgot-dialog-form {\n  min-width: 250px;\n  max-width: 500px;\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px;\n  padding-bottom: 20px; }\n\nh3 {\n  font-size: 4.3vw; }\n\n@media screen and (min-width: 680px) {\n    h3 {\n      font-size: 30px; } }\n"

/***/ }),

/***/ "./src/app/forgot-dialog/forgot-dialog.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/forgot-dialog/forgot-dialog.component.ts ***!
  \**********************************************************/
/*! exports provided: ForgotDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForgotDialogComponent", function() { return ForgotDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var ForgotDialogComponent = /** @class */ (function () {
    function ForgotDialogComponent(auth, dialogRef, data, activatedRoute, dialog) {
        this.auth = auth;
        this.dialogRef = dialogRef;
        this.data = data;
        this.activatedRoute = activatedRoute;
        this.dialog = dialog;
        this.error = false;
    }
    ForgotDialogComponent.prototype.ngOnInit = function () {
    };
    ForgotDialogComponent.prototype.onSubmitClick = function () {
        var _this = this;
        this.auth.authForgot().subscribe(function (userReturned) {
            var alertMessage = 'Email "' + userReturned['email'] + '" was sent reset email. ' +
                "If you don't see it in a few minutes please check your SPAM folder.";
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertMessageDialogComponent"], {
                width: '400px',
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function (err) {
            var alertMessage = 'Email "' + _this.auth.user['email'] + '" was not found!';
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertMessageDialogComponent"], {
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function () { });
        this.dialogRef.close();
    };
    ForgotDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-forgot-dialog',
            template: __webpack_require__(/*! ./forgot-dialog.component.html */ "./src/app/forgot-dialog/forgot-dialog.component.html"),
            styles: [__webpack_require__(/*! ./forgot-dialog.component.scss */ "./src/app/forgot-dialog/forgot-dialog.component.scss")]
        }),
        __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"], Object, _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]])
    ], ForgotDialogComponent);
    return ForgotDialogComponent;
}());



/***/ }),

/***/ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"currentAlbums\">\n  <h2>{{currentAlbum.name}}:</h2>\n  <div class=\"container\"\n    fxLayout=\"row wrap\"\n    fxLayoutGap=\"4px\"\n    fxLayoutAlign.gt-xs=\"space-evenly stretch\">\n    <mat-card *ngFor=\"let album of currentAlbums\" (click)=\"navToAlbum(album)\"\n      fxFlex.xl=\"16.2%\" fxFlex.lg=\"24.5%\" fxFlex.md=\"32.5%\" fxFlex.sm=\"49%\" fxFlex.xs=\"98%\">\n      <mat-card-header>\n        <mat-card-title>\n          <h3 fxFlexAlign>{{album.name}}</h3>\n        </mat-card-title>\n        <mat-card-subtitle>{{album.description}}</mat-card-subtitle>\n      </mat-card-header>\n      <div fxFill fxLayout=\"center center\">\n        <img mat-card-image [src]='(\"/protected/images/\"+album.featuredPhoto.filename) | secure'>\n      </div>\n      <mat-card-footer>\n      </mat-card-footer>\n    </mat-card>\n  </div>\n</div>\n\n<div *ngIf=\"!currentAlbums\">\n  <p>Waiting on server ...</p>\n</div>\n\n"

/***/ }),

/***/ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-card {\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px 10px 30px 10px;\n  margin-bottom: 5px;\n  cursor: pointer; }\n\n[mat-card-image] {\n  margin: 0 0 30px 0;\n  width: 100%;\n  -ms-grid-row-align: center;\n      align-self: center;\n  border-radius: 5px; }\n"

/***/ }),

/***/ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.ts ***!
  \**********************************************************************************/
/*! exports provided: GalleryPhotoAlbumsListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryPhotoAlbumsListComponent", function() { return GalleryPhotoAlbumsListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
/* harmony import */ var _classes_photo_classes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_classes/photo-classes */ "./src/app/_classes/photo-classes.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//import { ROOT_ALBUMLIST } from '../_classes/photo-albums-temp';
var GalleryPhotoAlbumsListComponent = /** @class */ (function () {
    function GalleryPhotoAlbumsListComponent(auth, router, dialog) {
        this.auth = auth;
        this.router = router;
        this.dialog = dialog;
    }
    GalleryPhotoAlbumsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentAlbum = new _classes_photo_classes__WEBPACK_IMPORTED_MODULE_5__["Album"];
        this.auth.getAlbum(0).subscribe(function (album) {
            console.log("Album 0 is :" + JSON.stringify(album, null, 2));
            //          this.router.navigate(['/gallery']);
            _this.currentAlbum = album;
            _this.auth.getAlbums(_this.currentAlbum.albums).subscribe(function (albums) { return _this.currentAlbums = albums; }, function (err) { return _this.errAlert('Problem getting albums!', err); });
        }, function (err) { return _this.errAlert('Problem getting album zero!', err); }, function () { });
        //    this.currentAlbum = ROOT_ALBUMLIST; // first time start with the root list
    };
    GalleryPhotoAlbumsListComponent.prototype.navToAlbum = function (album) {
        var _this = this;
        console.log('album is ' + JSON.stringify(album));
        if (album.albums) {
            this.currentAlbum = album;
            this.auth.getAlbums(album.albums).subscribe(function (albums) { return _this.currentAlbums = albums; }, function (err) { return _this.errAlert('Problem getting albums!', err); });
        }
        else {
            this.router.navigate(['/gallery']);
        }
    };
    ;
    GalleryPhotoAlbumsListComponent.prototype.errAlert = function (msg, err) {
        var alertMessage = msg + err.error;
        var dialogRef = this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertMessageDialogComponent"], {
            width: '400px',
            data: { alertMessage: alertMessage }
        });
        dialogRef.afterClosed().subscribe(function (result) { });
        console.log(err);
        this.router.navigate(['/gallery']);
    };
    GalleryPhotoAlbumsListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery-photo-albums-list',
            template: __webpack_require__(/*! ./gallery-photo-albums-list.component.html */ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.html"),
            styles: [__webpack_require__(/*! ./gallery-photo-albums-list.component.scss */ "./src/app/gallery-photo-albums-list/gallery-photo-albums-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"]])
    ], GalleryPhotoAlbumsListComponent);
    return GalleryPhotoAlbumsListComponent;
}());



/***/ }),

/***/ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/gallery-video-albums-list/gallery-video-albums-list.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  gallery-video-albums-list not yet implemented!\n</p>\n"

/***/ }),

/***/ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/gallery-video-albums-list/gallery-video-albums-list.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/gallery-video-albums-list/gallery-video-albums-list.component.ts ***!
  \**********************************************************************************/
/*! exports provided: GalleryVideoAlbumListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryVideoAlbumListComponent", function() { return GalleryVideoAlbumListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GalleryVideoAlbumListComponent = /** @class */ (function () {
    function GalleryVideoAlbumListComponent() {
    }
    GalleryVideoAlbumListComponent.prototype.ngOnInit = function () {
    };
    GalleryVideoAlbumListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery-video-albums-list',
            template: __webpack_require__(/*! ./gallery-video-albums-list.component.html */ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.html"),
            styles: [__webpack_require__(/*! ./gallery-video-albums-list.component.scss */ "./src/app/gallery-video-albums-list/gallery-video-albums-list.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], GalleryVideoAlbumListComponent);
    return GalleryVideoAlbumListComponent;
}());



/***/ }),

/***/ "./src/app/gallery/gallery.component.html":
/*!************************************************!*\
  !*** ./src/app/gallery/gallery.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <h2>Select which gallery you'd like to view:</h2>\n  <div class=\"container\"\n     fxLayout=\"row\"\n     fxLayout.xs=\"column\"\n     fxLayoutAlign.gt-xs=\"space-evenly center\"\n     fxLayoutGap=\"10px\">\n    <mat-card fxFlex=\"33\">\n      <mat-card-header fxLayoutAlign=\"center center\">\n        <mat-card-title>\n          <h3 fxFlexAlign>Picture Gallery</h3>\n        </mat-card-title>\n      </mat-card-header>\n      <img mat-card-image [routerLink]=\"['/photo-albums']\" [src]=\"'protected/images/2018-00-03Graduation0364.jpg' | secure\" alt=\"Rachel Grade 8 Grad\">\n    </mat-card>\n    <mat-card fxFlex=\"33\">\n      <mat-card-header fxLayoutAlign=\"center center\">\n        <mat-card-title>\n          <h3>Video Gallery</h3>\n        </mat-card-title>\n      </mat-card-header>\n      <img mat-card-image [routerLink]=\"['/videos']\" [src]=\"'protected/images/2018-05-23PianoRecital0356.jpg' | secure\" alt=\"Rachel Plays Piano\">\n    </mat-card>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/gallery/gallery.component.scss":
/*!************************************************!*\
  !*** ./src/app/gallery/gallery.component.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "img {\n  cursor: pointer; }\n\nh2, h3 {\n  text-align: center; }\n\nmat-card {\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px;\n  padding-bottom: 10px;\n  margin-bottom: 10px; }\n\n[mat-card-image] {\n  margin: 0;\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/gallery/gallery.component.ts":
/*!**********************************************!*\
  !*** ./src/app/gallery/gallery.component.ts ***!
  \**********************************************/
/*! exports provided: GalleryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryComponent", function() { return GalleryComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    GalleryComponent.prototype.ngOnInit = function () {
        if (!this.auth.isAuthenticated()) {
            if ((this.auth.hasLoggedInBefore()) && (!this.auth.isLoginExpired())) {
                // Someone has logged in before and still has an unexpired token, so
                // go ahead and auto-login with those saved credentials.
                this.auth.user['username'] = this.auth.lastLoggedInUsername();
                this.auth.user['level'] = Number(this.auth.lastLoggedInUserLevel());
                this.auth.setAuthenticated(true);
                console.log('Auto-login for user ' + this.auth.user['username']);
            }
            else {
                this.router.navigate(['/login']);
            }
        }
    };
    GalleryComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery',
            template: __webpack_require__(/*! ./gallery.component.html */ "./src/app/gallery/gallery.component.html"),
            styles: [__webpack_require__(/*! ./gallery.component.scss */ "./src/app/gallery/gallery.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], GalleryComponent);
    return GalleryComponent;
}());



/***/ }),

/***/ "./src/app/header/header.component.html":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <mat-toolbar class=\"toolbar\" fxFlex>\n      <span>{{CFG.settings.header.title}}</span>\n      <a mat-button routerLink=\"/gallery\" routerLinkActive=\"active\" fxFlexOffset=\"1\" >Home</a>\n      <a mat-button routerLink=\"/downloads\" routerLinkActive=\"active\">Downloads</a>\n      <button mat-button [matMenuTriggerFor]=\"galleryMenu\">Gallery Menu</button>\n      <mat-menu #galleryMenu=\"matMenu\">\n        <button mat-menu-item routerLink=\"/\" >Gallery Home</button>\n        <hr>\n        <button mat-menu-item routerLink=\"/videos\" >Video Gallery</button>\n        <button mat-menu-item routerLink=\"/pictures\">Picture Gallery</button>\n      </mat-menu>\n      <a mat-button routerLink=\"/about\" routerLinkActive=\"active\">About</a>\n      <span class=\"fill-space\"></span>\n      <a mat-button routerLink=\"/\" routerLinkActive=\"active\" (click)=\"auth.authLogout()\">Logout</a>\n  </mat-toolbar>\n</div>\n"

/***/ }),

/***/ "./src/app/header/header.component.scss":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/header/header.component.ts":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app.config */ "./src/app/app.config.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(auth, CFG) {
        this.auth = auth;
        this.CFG = CFG;
    }
    HeaderComponent.prototype.ngOnInit = function () { };
    HeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! ./header.component.html */ "./src/app/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.scss */ "./src/app/header/header.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"], _app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!auth.isAuthenticated()\">\n  <video *ngIf=\"auth.hasLoggedInBefore()\" autoplay muted loop id=\"BackImage\">\n    <source src=\"assets/video/Beach_Waves_Sunset-480p.mp4\" type=\"video/mp4\">\n  </video>\n  <img *ngIf=\"!auth.hasLoggedInBefore()\" src=\"assets/images/Mountain.jpg\" id=\"BackImage\" fxFlexFill>\n  <div class=\"login-container\" fxLayoutAlign=\"center center\">\n        <!-- fxLayout=\"row\"\n        fxLayout.sm=\"column\"\n        fxLayout.xs=\"column\" -->\n      <form novalidate #loginForm=\"ngForm\" class=\"login-form\" fxLayout=\"column\">\n        <mat-toolbar class=\"toolbar\">\n          <h3 align=\"center\">Login to www.McGrandle.com</h3>\n        </mat-toolbar>\n        <mat-form-field>\n          <input matInput maxlength=\"20\" placeholder=\"Username\" type=\"text\" [(ngModel)]=\"auth.user.username\" #username=\"ngModel\" name=\"username\" required>\n          <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n          <mat-hint>\n            <span [hidden]=\"username.pristine\">\n              <span [hidden]=\"!username.errors?.required\">** Username is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"Password\" [type]=\"hide ? 'password' : 'text'\"\n             [(ngModel)]=\"auth.user.password\" name=\"password\" #password=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hide = !hide\">{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"password.pristine\">\n              <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <div fxLayout=\"row\">\n          <button mat-raised-button color=\"primary\" type=\"button\" (click)=\"openRegisterDialog()\">Register New User</button>\n          <span class=\"fill-space\"></span>\n          <button mat-raised-button type=\"submit\"\n             color=\"primary\" [disabled]=\"loginForm.form.invalid\" (click)=\"onLogin()\" cdkFocusInitial>Login</button>\n        </div>\n        <a id=\"forgotCredentials\" align=\"center\" (click)=\"openForgotDialog()\">Forgot username or password</a>\n      </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/login/login.component.scss":
/*!********************************************!*\
  !*** ./src/app/login/login.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#BackImage {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-filter: opacity(60%);\n          filter: opacity(60%);\n  z-index: -1;\n  background-position: right;\n  background-size: cover; }\n\n.login-container {\n  min-height: 100vh; }\n\n.login-form {\n  min-width: 300px;\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px; }\n\n#forgotCredentials {\n  padding-top: 10px;\n  color: indigo; }\n\na {\n  cursor: pointer; }\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../forgot-dialog/forgot-dialog.component */ "./src/app/forgot-dialog/forgot-dialog.component.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginComponent = /** @class */ (function () {
    function LoginComponent(auth, dialog, router) {
        this.auth = auth;
        this.dialog = dialog;
        this.router = router;
        this.hide = true;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.auth.user = {};
        if ((this.auth.hasLoggedInBefore()) && (!this.auth.isLoginExpired())) {
            // Someone has logged in before and still has an unexpired token, so
            // go ahead and auto-login with those saved credentials.
            this.auth.user['username'] = this.auth.lastLoggedInUsername();
            this.auth.user['level'] = Number(this.auth.lastLoggedInUserLevel());
            this.auth.setAuthenticated(true);
            this.router.navigate(['/gallery']);
            console.log('Auto-login for user ' + this.auth.user['username']);
        }
    };
    ;
    LoginComponent.prototype.onLogin = function () {
        var _this = this;
        this.auth.authLogin().subscribe(function () {
            console.log("User " + _this.auth.user['username'] + " is logged in");
            _this.router.navigate(['/gallery']);
        }, function (err) {
            var alertMessage = 'Problem logging on: ' + err.error;
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_6__["AlertMessageDialogComponent"], {
                width: '400px',
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
            console.log(err);
            _this.router.navigate(['/login']);
        }, function () { });
    };
    ;
    LoginComponent.prototype.onSubmitClick = function () {
        var _this = this;
        this.auth.authForgot().subscribe(function (userReturned) {
            var alertMessage = 'Email "' + userReturned['email'] + '" was sent reset email. ' +
                "If you don't see it in a few minutes please check your SPAM folder.";
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_6__["AlertMessageDialogComponent"], {
                width: '400px',
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function (err) {
            var alertMessage = 'Email "' + _this.auth.user['email'] + '" was not found!';
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_6__["AlertMessageDialogComponent"], {
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function () { });
    };
    LoginComponent.prototype.openRegisterDialog = function () {
        var dialogRef = this.dialog.open(_register_register_component__WEBPACK_IMPORTED_MODULE_4__["RegisterComponent"], {
            data: { name: this.auth.user['username'] }
        });
    };
    LoginComponent.prototype.openForgotDialog = function () {
        var dialogRef = this.dialog.open(_forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_5__["ForgotDialogComponent"], {
            data: { name: this.auth.user['email'] }
        });
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/login/login.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.html":
/*!**************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  That page is not found.  Please report this to Darren at the link below.\n</p>\n"

/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.ts":
/*!************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.ts ***!
  \************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PageNotFoundComponent = /** @class */ (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.scss */ "./src/app/page-not-found/page-not-found.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/register/register.component.html":
/*!**************************************************!*\
  !*** ./src/app/register/register.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"register-container\" fxLayoutAlign=\"center center\">\n      <!-- fxLayout=\"row\"\n      fxLayout.sm=\"column\"\n      fxLayout.xs=\"column\" -->\n    <form novalidate #registerForm=\"ngForm\" class=\"register-form\" fxLayout=\"column\" (ngSubmit)=\"onRegisterClick()\">\n      <mat-toolbar class=\"toolbar\">\n        <h3 align=\"center\">Register a new user</h3>\n      </mat-toolbar>\n      <mat-form-field>\n        <input matInput maxlength=\"30\" placeholder=\"Full Name\" type=\"text\" [(ngModel)]=\"auth.user.name\" #name=\"ngModel\" name=\"name\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"name.pristine\">\n            <span [hidden]=\"!name.errors?.required\">** Full Name is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <mat-form-field>\n        <input matInput maxlength=\"20\" placeholder=\"Choose a username\" type=\"text\" [(ngModel)]=\"auth.user.username\" #username=\"ngModel\" name=\"username\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"username.pristine\">\n            <span [hidden]=\"!username.errors?.required\">** Username is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <mat-form-field>\n        <input matInput maxlength=\"30\" placeholder=\"Choose a password\" [type]=\"hidePass ? 'password' : 'text'\"\n           [(ngModel)]=\"auth.user.password\" name=\"password\" #password=\"ngModel\" required>\n        <mat-icon matSuffix (click)=\"hidePass = !hidePass\">{{hidePass ? 'visibility' : 'visibility_off'}}</mat-icon>\n        <mat-hint>\n          <span [hidden]=\"password.pristine\">\n            <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <mat-form-field>\n        <input matInput maxlength=\"40\" placeholder=\"Email\" type=\"email\" [(ngModel)]=\"auth.user.email\" #email=\"ngModel\" name=\"email\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"email.pristine\">\n            <span [hidden]=\"!email.errors?.required\">** email is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <div fxLayout=\"row\">\n        <button mat-button mat-dialog-close>Cancel</button>\n        <span class=\"fill-space\"></span>\n        <button mat-raised-button routerLink=\"/gallery\" routerLinkActive=\"active\" type=\"submit\" color=\"primary\" [disabled]=\"registerForm.form.invalid\">Register</button>\n      </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "./src/app/register/register.component.scss":
/*!**************************************************!*\
  !*** ./src/app/register/register.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".register-form {\n  min-width: 200px;\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px; }\n\nh3 {\n  font-size: 4.8vw; }\n\n@media screen and (min-width: 412px) {\n    h3 {\n      font-size: 25px; } }\n"

/***/ }),

/***/ "./src/app/register/register.component.ts":
/*!************************************************!*\
  !*** ./src/app/register/register.component.ts ***!
  \************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(auth, dialogRef, data) {
        this.auth = auth;
        this.dialogRef = dialogRef;
        this.data = data;
        this.hidePass = true;
    }
    RegisterComponent.prototype.onRegisterClick = function () {
        var _this = this;
        this.auth.authRegister().subscribe(function (data) {
            console.log("User " + _this.auth.user['username'] + " was created successfully");
        }, function (err) { return console.log(err); }, function () { });
        this.dialogRef.close();
    };
    RegisterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.scss */ "./src/app/register/register.component.scss")]
        }),
        __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    confName: 'dev'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/darren/webapps/homesite/client/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map