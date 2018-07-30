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

/***/ "./src/app/_classes/user-classes.ts":
/*!******************************************!*\
  !*** ./src/app/_classes/user-classes.ts ***!
  \******************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
// user-classes.ts - Declaration of User class
// Note - I have the constructors setting initial values so all instances
// are set up with fields in the same order every time.
var User = /** @class */ (function () {
    function User() {
        this._id = -1;
        this.name = '';
        this.username = '';
        this.password = '';
        this.email = '';
        this.level = 0;
    }
    return User;
}());

;


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
/* harmony import */ var crypto_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! crypto-ts */ "./node_modules/crypto-ts/esm5/crypto-ts.js");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../app.config */ "./src/app/app.config.ts");
/* harmony import */ var _classes_user_classes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_classes/user-classes */ "./src/app/_classes/user-classes.ts");
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
    function AuthService(http, CFG) {
        this.http = http;
        this.CFG = CFG;
        this._authenticated = false;
        // set up default starting values
        localStorage.setItem('userId', "-1"); //no user logged in to start with
    }
    AuthService.prototype.isAuthenticated = function () {
        //    return this._authenticated.value;
        return !this.isLoginExpired();
    };
    AuthService.prototype.setAuthenticated = function (value) {
        //    this._authenticated.next(value);
        this._authenticated = value;
    };
    AuthService.prototype.authLogin = function () {
        var _this = this;
        // before transmitting user object to server for authentication, encrypt pw
        this.user.password = this.encryptPass(this.user.password);
        return this.http.post('/api/users/login', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (res) { return _this.storeUserResponse(res); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function () { return _this.setAuthenticated(true); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authRegister = function () {
        this.user.password = this.encryptPass(this.user.password);
        return this.http.post('/api/users/create', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authForgot = function () {
        return this.http.post('/api/users/forgot', this.user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["shareReplay"])());
    };
    AuthService.prototype.authChangePassword = function (token) {
        this.user.password = this.encryptPass(this.user.password);
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
    AuthService.prototype.authLogout = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('level');
        localStorage.removeItem('expiresAt');
        this.setAuthenticated(false);
        this.user = new _classes_user_classes__WEBPACK_IMPORTED_MODULE_5__["User"];
    };
    AuthService.prototype.encryptPass = function (password) {
        return crypto_ts__WEBPACK_IMPORTED_MODULE_3__["AES"].encrypt(password, this.CFG.const.auth.password_secret).toString();
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
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _app_config__WEBPACK_IMPORTED_MODULE_4__["AppConfig"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/_services/media.service.ts":
/*!********************************************!*\
  !*** ./src/app/_services/media.service.ts ***!
  \********************************************/
/*! exports provided: MediaService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaService", function() { return MediaService; });
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



var MediaService = /** @class */ (function () {
    function MediaService(http) {
        this.http = http;
    }
    ;
    MediaService.prototype.getPhotoById = function (id) {
        return this.http.get('/api/photos/photo-by-id/' + id);
    };
    ;
    MediaService.prototype.getPhotosByIdArray = function (photos) {
        return this.http.get('/api/photos/photos/(' + photos.join('+') + ')');
    };
    ;
    MediaService.prototype.getThumbsByIdArray = function (thumbs) {
        return this.http.get('/api/photos/thumbs/(' + thumbs.join('+') + ')');
    };
    ;
    MediaService.prototype.getPhotoAlbumById = function (id) {
        return this.http.get('/api/photos/album-by-id/' + id);
    };
    ;
    MediaService.prototype.getPhotoAlbumByPath = function (path) {
        var pathString = '(' + path.split('/').join('+') + ')';
        if (pathString == '(albums)')
            pathString = '()'; // 'albums' is our root path.
        return this.http.get('/api/photos/album-by-path/' + pathString);
    };
    ;
    MediaService.prototype.getPhotoAlbumsByIdArray = function (albums) {
        var albumString = '(' + albums.join('+') + ')';
        return this.http.get('/api/photos/albums/' + albumString);
    };
    ;
    MediaService.prototype.getPhotoAlbumByURL = function (url) {
        var _this = this;
        // This function takes in an UrlSegment array, joins those segments into a path,
        // passes that path to getAlbumsByPath.  When that resolves it saves the resulting
        // album into curPhotoAlbum variable (class scope).  Ultimately this function 
        // returns an observable which resolves to the album from getPhotoAlbumByPath.
        return url.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["flatMap"])(function (segments) { return _this.getPhotoAlbumByPath(segments.join('/')); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (album) { return _this.curPhotoAlbum = album; }));
    };
    ;
    MediaService.prototype.getPhotoAlbumsByURL = function (url) {
        var _this = this;
        // This function effectively collapses three observables into one: It first takes 
        // in an observable of an UrlSegment array. When that resolves, it joins those 
        // segments into a path, and passes that path to getPhotoAlbumsByPath (the second 
        // observable). Once that observable resolves into an album, it then saves the result
        // into the curPhotoAlbum variable (class scope) and finally calls getPhotoAlbums 
        // (the third observable) with that album's album.albums array.  This entire method
        // ultimately returns an observable that resolves to the resulting array of album 
        // objects from getPhotoAlbumsByIdArray.  
        // Whew - that's a lot for just a few lines of code!  :)
        return url.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(function (segments) { return _this.getPhotoAlbumByPath(segments.join('/')); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (album) { return _this.curPhotoAlbum = album; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(function (album) { return _this.getPhotoAlbumsByIdArray(album.albums); }));
    };
    ;
    MediaService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], MediaService);
    return MediaService;
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

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./change-password/change-password.component */ "./src/app/change-password/change-password.component.ts");
/* harmony import */ var _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gallery/gallery.component */ "./src/app/gallery/gallery.component.ts");
/* harmony import */ var _gallery_video_albums_gallery_video_albums_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gallery-video-albums/gallery-video-albums.component */ "./src/app/gallery-video-albums/gallery-video-albums.component.ts");
/* harmony import */ var _gallery_photo_albums_gallery_photo_albums_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gallery-photo-albums/gallery-photo-albums.component */ "./src/app/gallery-photo-albums/gallery-photo-albums.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");
/* harmony import */ var _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./downloads/downloads.component */ "./src/app/downloads/downloads.component.ts");
/* harmony import */ var _gallery_photo_photos_gallery_photo_photos_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./gallery-photo-photos/gallery-photo-photos.component */ "./src/app/gallery-photo-photos/gallery-photo-photos.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var appRoutes = [
    { path: 'gallery', component: _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_4__["GalleryComponent"] },
    { path: 'videos', component: _gallery_video_albums_gallery_video_albums_component__WEBPACK_IMPORTED_MODULE_5__["GalleryVideoAlbumsComponent"] },
    { path: 'albums', component: _gallery_photo_albums_gallery_photo_albums_component__WEBPACK_IMPORTED_MODULE_6__["GalleryPhotoAlbumsComponent"] },
    { path: 'albums', children: [
            { path: '**', component: _gallery_photo_albums_gallery_photo_albums_component__WEBPACK_IMPORTED_MODULE_6__["GalleryPhotoAlbumsComponent"] }
        ] },
    { path: 'photos', children: [
            { path: '**', component: _gallery_photo_photos_gallery_photo_photos_component__WEBPACK_IMPORTED_MODULE_10__["GalleryPhotoPhotosComponent"] }
        ] },
    { path: 'downloads', component: _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_9__["DownloadsComponent"] },
    { path: 'changepass/:username/:token', component: _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_3__["ChangePasswordComponent"] },
    { path: 'about', component: _about_about_component__WEBPACK_IMPORTED_MODULE_8__["AboutComponent"] },
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__["PageNotFoundComponent"] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(appRoutes)
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
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
    }
    AppConfig.prototype.load = function () {
        var _this = this;
        var jsonFile = "assets/config/config." + _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].confName + ".json";
        return new Promise(function (resolve, reject) {
            _this.http.get(jsonFile).subscribe(function (res) {
                _this.const = res;
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
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/overlay */ "./node_modules/@angular/cdk/esm5/overlay.es5.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.config */ "./src/app/app.config.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/footer/footer.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./forgot-dialog/forgot-dialog.component */ "./src/app/forgot-dialog/forgot-dialog.component.ts");
/* harmony import */ var _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./change-password/change-password.component */ "./src/app/change-password/change-password.component.ts");
/* harmony import */ var _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./gallery/gallery.component */ "./src/app/gallery/gallery.component.ts");
/* harmony import */ var _gallery_video_albums_gallery_video_albums_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./gallery-video-albums/gallery-video-albums.component */ "./src/app/gallery-video-albums/gallery-video-albums.component.ts");
/* harmony import */ var _gallery_photo_albums_gallery_photo_albums_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./gallery-photo-albums/gallery-photo-albums.component */ "./src/app/gallery-photo-albums/gallery-photo-albums.component.ts");
/* harmony import */ var _gallery_photo_photos_gallery_photo_photos_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./gallery-photo-photos/gallery-photo-photos.component */ "./src/app/gallery-photo-photos/gallery-photo-photos.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./about/about.component */ "./src/app/about/about.component.ts");
/* harmony import */ var _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./downloads/downloads.component */ "./src/app/downloads/downloads.component.ts");
/* harmony import */ var _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./_helpers/jwt-interceptor */ "./src/app/_helpers/jwt-interceptor.ts");
/* harmony import */ var _helpers_secure_pipe__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./_helpers/secure.pipe */ "./src/app/_helpers/secure.pipe.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






//for configuration file read during initialization:
























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"],
                _header_header_component__WEBPACK_IMPORTED_MODULE_12__["HeaderComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_13__["FooterComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_14__["LoginComponent"],
                _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_15__["AlertMessageDialogComponent"],
                _register_register_component__WEBPACK_IMPORTED_MODULE_16__["RegisterComponent"],
                _register_register_component__WEBPACK_IMPORTED_MODULE_16__["EqualDirective"],
                _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_17__["ForgotDialogComponent"],
                _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_18__["ChangePasswordComponent"],
                _gallery_gallery_component__WEBPACK_IMPORTED_MODULE_19__["GalleryComponent"],
                _gallery_video_albums_gallery_video_albums_component__WEBPACK_IMPORTED_MODULE_20__["GalleryVideoAlbumsComponent"],
                _gallery_photo_albums_gallery_photo_albums_component__WEBPACK_IMPORTED_MODULE_21__["GalleryPhotoAlbumsComponent"],
                _gallery_photo_photos_gallery_photo_photos_component__WEBPACK_IMPORTED_MODULE_22__["GalleryPhotoPhotosComponent"],
                _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_23__["PageNotFoundComponent"],
                _about_about_component__WEBPACK_IMPORTED_MODULE_24__["AboutComponent"],
                _downloads_downloads_component__WEBPACK_IMPORTED_MODULE_25__["DownloadsComponent"],
                _helpers_secure_pipe__WEBPACK_IMPORTED_MODULE_27__["SecurePipe"]
            ],
            imports: [
                _app_routing_module__WEBPACK_IMPORTED_MODULE_11__["AppRoutingModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
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
                    provide: _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_3__["OverlayContainer"],
                    useClass: _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_3__["FullscreenOverlayContainer"]
                },
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"],
                    useClass: _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_26__["JwtInterceptor"],
                    multi: true
                }
            ],
            entryComponents: [
                _register_register_component__WEBPACK_IMPORTED_MODULE_16__["RegisterComponent"], _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_17__["ForgotDialogComponent"], _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_15__["AlertMessageDialogComponent"]
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

module.exports = "<div *ngIf=\"!auth.isAuthenticated()\">\n  <!-- <video autoplay muted loop id=\"BackImage\">\n    <source src=\"assets/video/Piano480p.mp4\" type=\"video/mp4\">\n  </video> -->\n  <img src=\"assets/images/Mountain.jpg\" id=\"BackImage\" fxFlexFill>\n  <div class=\"change-password-container\" fxLayoutAlign=\"center center\">\n        <!-- fxLayout=\"row\"\n        fxLayout.sm=\"column\"\n        fxLayout.xs=\"column\" -->\n      <form novalidate #changePasswordForm=\"ngForm\" class=\"change-password-form\" fxLayout=\"column\">\n        <mat-toolbar class=\"toolbar\">\n          <h3 align=\"center\">Change your password</h3>\n        </mat-toolbar>\n        <p>Changing password for user: {{ auth.user.username }}</p>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"New password\" [type]=\"hidePassword ? 'password' : 'text'\" ngModel #password=\"ngModel\" name=\"password\" required>\n          <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n          <mat-icon matSuffix (click)=\"hidePassword = !hidePassword\">{{hidePassword ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"password.pristine\">\n              <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"Re-Enter your new password\" [type]=\"hidePassCheck ? 'password' : 'text'\" ngModel name=\"passcheck\" #passcheck=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hidePassCheck = !hidePassCheck\">{{hidePassCheck ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"passcheck.pristine\">\n              <span [hidden]=\"password.value === passcheck.value\">** Passwords are not the same **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <div fxLayout=\"row\">\n          <span class=\"fill-space\"></span>\n          <button mat-raised-button type=\"submit\"\n             color=\"primary\" [disabled]=\"password.value !== passcheck.value\" (click)=\"onChangePassword(password.value)\">Change Password</button>\n        </div>\n      </form>\n  </div>\n\n</div>\n"

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
/* harmony import */ var _classes_user_classes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_classes/user-classes */ "./src/app/_classes/user-classes.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
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
        this.auth.user = new _classes_user_classes__WEBPACK_IMPORTED_MODULE_3__["User"]; // first clear out any old user info
        this.auth.user.username = this.route.snapshot.paramMap.get('username');
        this.token = this.route.snapshot.paramMap.get('token');
    };
    ChangePasswordComponent.prototype.onChangePassword = function (password) {
        var _this = this;
        this.auth.user.password = password;
        this.auth.authChangePassword(this.token).subscribe(function (result) {
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_5__["AlertMessageDialogComponent"], {
                data: { alertMessage: 'Password changed for "' + _this.auth.user['username'] + '"' }
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
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
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

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <mat-toolbar class=\"toolbar\" fxLayout=\"column\" fxLayoutGap=\"0px\" fxLayoutAlign=\"center center\">\n      <h2>{{CFG.const.footer.title}}</h2>\n      <p>Contact <a href=\"mailto:{{CFG.const.footer.email}}\">{{CFG.const.footer.email}}</a> with any issues.</p>\n  </mat-toolbar>\n</div>\n"

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
    FooterComponent.prototype.ngOnInit = function () {
    };
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

/***/ "./src/app/gallery-photo-albums/gallery-photo-albums.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-photo-albums/gallery-photo-albums.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"displayAlbums\">\n  <h2>{{media.curPhotoAlbum.name}}:</h2>\n  <div class=\"container\"\n    fxLayout=\"row wrap\"\n    fxLayoutGap=\"4px\"\n    fxLayoutAlign.gt-xs=\"space-evenly stretch\">\n    <mat-card *ngFor=\"let album of displayAlbums\" (click)=\"updateDisplayAlbumOrNavToPhotos(album)\"\n      fxFlex.xl=\"16.2%\" fxFlex.lg=\"24.5%\" fxFlex.md=\"32.5%\" fxFlex.sm=\"49%\" fxFlex.xs=\"98%\">\n      <mat-card-header>\n        <mat-card-title>\n          <h3 fxFlexAlign>{{album.name}}</h3>\n        </mat-card-title>\n        <mat-card-subtitle>{{album.description}}</mat-card-subtitle>\n      </mat-card-header>\n      <div *ngIf='album.featuredPhoto.filename' fxFill fxLayout=\"center center\">\n        <img mat-card-image [src]='(album.featuredPhoto.fullPath) | secure'>\n      </div>\n      <mat-card-footer>  \n      </mat-card-footer>\n    </mat-card>\n  </div>\n</div>\n\n<div *ngIf=\"!displayAlbums\">\n  <p>Waiting on server ...</p>\n</div>\n\n"

/***/ }),

/***/ "./src/app/gallery-photo-albums/gallery-photo-albums.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-photo-albums/gallery-photo-albums.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-card {\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px 10px 30px 10px;\n  margin-bottom: 5px;\n  cursor: pointer; }\n\n[mat-card-image] {\n  margin: 0 0 30px 0;\n  width: 100%;\n  -ms-grid-row-align: center;\n      align-self: center;\n  border-radius: 5px; }\n"

/***/ }),

/***/ "./src/app/gallery-photo-albums/gallery-photo-albums.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/gallery-photo-albums/gallery-photo-albums.component.ts ***!
  \************************************************************************/
/*! exports provided: GalleryPhotoAlbumsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryPhotoAlbumsComponent", function() { return GalleryPhotoAlbumsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _services_media_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/media.service */ "./src/app/_services/media.service.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var GalleryPhotoAlbumsComponent = /** @class */ (function () {
    function GalleryPhotoAlbumsComponent(media, route, router, dialog, location) {
        this.media = media;
        this.route = route;
        this.router = router;
        this.dialog = dialog;
        this.location = location;
    }
    GalleryPhotoAlbumsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this observable changes on init, or when nav button hit (back or fwd)
        this.media.getPhotoAlbumsByURL(this.route.url).subscribe(function (albums) { return _this.displayAlbums = albums; }, function (err) { return _this.errAlert('Problem getting albums!', err); });
    };
    ;
    GalleryPhotoAlbumsComponent.prototype.updateDisplayAlbumOrNavToPhotos = function (album) {
        var _this = this;
        this.media.curPhotoAlbum = album; // go down one level (directory).
        if (album.albums.length > 0) {
            this.media.getPhotoAlbumsByIdArray(album.albums).subscribe(function (albums) {
                _this.displayAlbums = albums; // set albums to display
                var url = 'albums' + _this.router.createUrlTree([album.path]).toString();
                _this.location.go(url); // Update the URL in the browser window without navigating.
            }, function (err) { return _this.errAlert('Problem getting albums!', err); });
        }
        else {
            this.router.navigate(['/photos/' + album.path]);
        }
    };
    ;
    GalleryPhotoAlbumsComponent.prototype.errAlert = function (msg, err) {
        var alertMessage = msg + err.error;
        var dialogRef = this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_5__["AlertMessageDialogComponent"], {
            width: '400px',
            data: { alertMessage: alertMessage }
        });
        dialogRef.afterClosed().subscribe(function (result) { });
        console.log(err);
        this.router.navigate(['/gallery']);
    };
    ;
    GalleryPhotoAlbumsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery-photo-albums',
            template: __webpack_require__(/*! ./gallery-photo-albums.component.html */ "./src/app/gallery-photo-albums/gallery-photo-albums.component.html"),
            styles: [__webpack_require__(/*! ./gallery-photo-albums.component.scss */ "./src/app/gallery-photo-albums/gallery-photo-albums.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_media_service__WEBPACK_IMPORTED_MODULE_4__["MediaService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]])
    ], GalleryPhotoAlbumsComponent);
    return GalleryPhotoAlbumsComponent;
}());



/***/ }),

/***/ "./src/app/gallery-photo-photos/gallery-photo-photos.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-photo-photos/gallery-photo-photos.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"full-screen\" *ngIf=\"curPhoto && curThumbs\">\n  <div class=\"title\" fxLayout=\"row\">\n    <h2><span>{{media.curPhotoAlbum.name}}:</span></h2>\n    <span class=\"fill-space\"></span>\n    <a [download]='curPhoto.filename' [href]='curPhoto.fullPath | secure'>\n      <mat-icon>vertical_align_bottom</mat-icon>\n    </a>\n  </div>\n  <div class=\"container\"\n    fxLayout=\"column\"\n    fxLayoutGap=\"4px\"\n    fxLayoutAlign.gt-xs=\"space-evenly stretch\">\n    <!-- large display picture -->\n    <div fxHide.lt-sm fxLayout=\"column\" fxLayoutAlign=\"none center\">\n      <mat-card (click)=\"makeFullscreen()\" >\n        <img class=\"img-large\" mat-card-image [src]='curPhoto.fullPath | secure'>\n      </mat-card>\n    </div>\n    <!-- scrollable row of thumbnails -->\n    <div id=\"thumbnails\" fxLayout.gt-xs=\"row\" fxLayout.xs=\"column\" fxLayoutGap.gt-xs=\"6px\" fxLayoutGap.xs=\"1px\" fxLayoutAlign.gt-xs=\"none center\" fxLayoutAlign.xs=\"none none\">  \n      <div *ngFor=\"let photoId of media.curPhotoAlbum.photos; index as i\" (click)=\"changePhoto(photoId)\"\n        fxFlex.xl=\"0 0 4.25%\" fxFlex.lg=\"0 0 6.31%\" fxFlex.md=\"0 0 7.8%\" fxFlex.sm=\"0 0 11.75%\" fxFlex.xs=\"1 1 auto\">\n        <img #thumbnail fxFlexAlignSelf=\"center\" class=\"img-thumbs\" [id]=\"highlightAndScroll(photoId, thumbnail)\" [src]='curThumbs[i] | secure'>\n      </div>\n    </div>>\n  </div>\n</div>\n\n<div *ngIf=\"!(curPhoto && curThumbs)\">\n  <p>Waiting on server ...</p>\n</div>\n"

/***/ }),

/***/ "./src/app/gallery-photo-photos/gallery-photo-photos.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-photo-photos/gallery-photo-photos.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-card-image {\n  border-radius: 6px;\n  border: 3px;\n  border-color: black;\n  border-style: ridge; }\n\n.img-large {\n  max-height: 60vh;\n  width: auto;\n  max-width: 95vw; }\n\n.title {\n  margin: 0 0 5px 0;\n  padding-top: 5px;\n  color: floralwhite; }\n\n.title h2 {\n    margin: 0;\n    padding: 5px; }\n\n.title a {\n    color: floralwhite; }\n\n.title a .mat-icon {\n      padding: 5px;\n      margin-right: 5px; }\n\n.mat-card {\n  cursor: pointer;\n  background-color: black; }\n\n#thumbnails {\n  overflow: scroll; }\n\n.img-thumbs {\n  cursor: pointer;\n  border-radius: 6px;\n  border: 3px;\n  border-color: black;\n  border-style: ridge;\n  width: 100%; }\n\n#selected {\n  border-color: white; }\n\n#full-screen {\n  background-color: black;\n  border-radius: 6px; }\n"

/***/ }),

/***/ "./src/app/gallery-photo-photos/gallery-photo-photos.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/gallery-photo-photos/gallery-photo-photos.component.ts ***!
  \************************************************************************/
/*! exports provided: KEY_CODE, GalleryPhotoPhotosComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_CODE", function() { return KEY_CODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryPhotoPhotosComponent", function() { return GalleryPhotoPhotosComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_media_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/media.service */ "./src/app/_services/media.service.ts");
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






Event;
var KEY_CODE;
(function (KEY_CODE) {
    KEY_CODE[KEY_CODE["PAGE_UP"] = 33] = "PAGE_UP";
    KEY_CODE[KEY_CODE["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KEY_CODE[KEY_CODE["END"] = 35] = "END";
    KEY_CODE[KEY_CODE["HOME"] = 36] = "HOME";
    KEY_CODE[KEY_CODE["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KEY_CODE[KEY_CODE["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
})(KEY_CODE || (KEY_CODE = {}));
;
var GalleryPhotoPhotosComponent = /** @class */ (function () {
    //  selectedPhoto: Observable<any>;
    function GalleryPhotoPhotosComponent(media, route, router, dialog) {
        this.media = media;
        this.route = route;
        this.router = router;
        this.dialog = dialog;
        this.version = _angular_material__WEBPACK_IMPORTED_MODULE_1__["VERSION"];
    }
    GalleryPhotoPhotosComponent.prototype.ngOnInit = function () {
        var _this = this;
        // If called from gallery-photo-albums component then the
        // media.curPhotoAlbum variable will already be set up. If not
        // we were probably called by a browser typed link or refresh.
        if (this.media.curPhotoAlbum) {
            this.setCurrentValues(this.media.curPhotoAlbum.photos);
        }
        else {
            this.media.getPhotoAlbumByURL(this.route.url).subscribe(function (album) { return _this.setCurrentValues(album.photos); }, function (err) { return _this.errAlert('Problem getting albums!', err); });
        }
    };
    GalleryPhotoPhotosComponent.prototype.setCurrentValues = function (photos) {
        var _this = this;
        this.media.getPhotoById(photos[0]).subscribe(function (photo) { return _this.curPhoto = photo; });
        this.media.getThumbsByIdArray(photos).subscribe(function (thumbs) { return _this.curThumbs = thumbs; });
    };
    GalleryPhotoPhotosComponent.prototype.changePhoto = function (photo) {
        this.curPhoto = photo;
    };
    GalleryPhotoPhotosComponent.prototype.highlightAndScroll = function (photoId, e) {
        if (photoId === this.curPhoto._id) {
            e.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
            return "selected"; // changes the id property of this element so css styles can outline it
        }
        return null;
    };
    GalleryPhotoPhotosComponent.prototype.keyEvent = function (event) {
        var _this = this;
        if (event.keyCode in KEY_CODE) {
            var nextIndex = 0;
            var curIndex = Number(this.curPhoto._id);
            switch (event.keyCode) {
                case KEY_CODE.RIGHT_ARROW:
                    nextIndex = (curIndex === this.media.curPhotoAlbum.photos.length - 1) ? 0 : curIndex + 1;
                    break;
                case KEY_CODE.LEFT_ARROW:
                    nextIndex = (curIndex === 0) ? this.media.curPhotoAlbum.photos.length - 1 : curIndex - 1;
                    break;
                case KEY_CODE.END:
                    nextIndex = this.media.curPhotoAlbum.photos.length - 1;
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
            this.media.getPhotoById(nextIndex).subscribe(function (photo) { return _this.curPhoto = photo; });
        }
    };
    GalleryPhotoPhotosComponent.prototype.makeFullscreen = function () {
        var i = document.getElementById('full-screen');
        if (i.requestFullscreen) {
            i.requestFullscreen();
        }
        else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
        }
        else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
        }
        else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
        }
    };
    GalleryPhotoPhotosComponent.prototype.errAlert = function (msg, err) {
        var alertMessage = msg + err.error;
        var dialogRef = this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AlertMessageDialogComponent"], {
            width: '400px',
            data: { alertMessage: alertMessage }
        });
        dialogRef.afterClosed().subscribe(function (result) { });
        console.log(err);
        this.router.navigate(['/gallery']);
    };
    ;
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('window:keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], GalleryPhotoPhotosComponent.prototype, "keyEvent", null);
    GalleryPhotoPhotosComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery-photo-photos',
            template: __webpack_require__(/*! ./gallery-photo-photos.component.html */ "./src/app/gallery-photo-photos/gallery-photo-photos.component.html"),
            styles: [__webpack_require__(/*! ./gallery-photo-photos.component.scss */ "./src/app/gallery-photo-photos/gallery-photo-photos.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_media_service__WEBPACK_IMPORTED_MODULE_3__["MediaService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"]])
    ], GalleryPhotoPhotosComponent);
    return GalleryPhotoPhotosComponent;
}());



/***/ }),

/***/ "./src/app/gallery-video-albums/gallery-video-albums.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-video-albums/gallery-video-albums.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  gallery-video-albums not yet implemented!\n</p>\n"

/***/ }),

/***/ "./src/app/gallery-video-albums/gallery-video-albums.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/gallery-video-albums/gallery-video-albums.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/gallery-video-albums/gallery-video-albums.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/gallery-video-albums/gallery-video-albums.component.ts ***!
  \************************************************************************/
/*! exports provided: GalleryVideoAlbumsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GalleryVideoAlbumsComponent", function() { return GalleryVideoAlbumsComponent; });
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

var GalleryVideoAlbumsComponent = /** @class */ (function () {
    function GalleryVideoAlbumsComponent() {
    }
    GalleryVideoAlbumsComponent.prototype.ngOnInit = function () {
    };
    GalleryVideoAlbumsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gallery-video-albums',
            template: __webpack_require__(/*! ./gallery-video-albums.component.html */ "./src/app/gallery-video-albums/gallery-video-albums.component.html"),
            styles: [__webpack_require__(/*! ./gallery-video-albums.component.scss */ "./src/app/gallery-video-albums/gallery-video-albums.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], GalleryVideoAlbumsComponent);
    return GalleryVideoAlbumsComponent;
}());



/***/ }),

/***/ "./src/app/gallery/gallery.component.html":
/*!************************************************!*\
  !*** ./src/app/gallery/gallery.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <h2>Select which gallery you'd like to view:</h2>\n  <div class=\"container\"\n     fxLayout=\"row\"\n     fxLayout.xs=\"column\"\n     fxLayoutAlign.gt-xs=\"space-evenly center\"\n     fxLayoutGap=\"10px\">\n    <mat-card fxFlex=\"33\">\n      <mat-card-header fxLayoutAlign=\"center center\">\n        <mat-card-title>\n          <h3 fxFlexAlign>Picture Gallery</h3>\n        </mat-card-title>\n      </mat-card-header>\n      <img mat-card-image [routerLink]=\"['/albums']\" [src]=\"CFG.const.gallery.featuredPhoto.filename | secure\">\n    </mat-card>\n    <mat-card fxFlex=\"33\">\n      <mat-card-header fxLayoutAlign=\"center center\">\n        <mat-card-title>\n          <h3>Video Gallery</h3>\n        </mat-card-title>\n      </mat-card-header>\n      <img mat-card-image [routerLink]=\"['/videos']\" [src]=\"CFG.const.gallery.featuredVideo.filename | secure\">\n    </mat-card>\n  </div>\n</div>\n"

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
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app.config */ "./src/app/app.config.ts");
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
    function GalleryComponent(auth, router, CFG) {
        this.auth = auth;
        this.router = router;
        this.CFG = CFG;
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
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _app_config__WEBPACK_IMPORTED_MODULE_3__["AppConfig"]])
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

module.exports = "<div *ngIf=\"auth.isAuthenticated()\">\n  <mat-toolbar class=\"toolbar\" fxFlex>\n      <span>{{CFG.const.header.title}}</span>\n      <a mat-button routerLink=\"/gallery\" routerLinkActive=\"active\" fxFlexOffset=\"1\" >Home</a>\n      <a mat-button routerLink=\"/downloads\" routerLinkActive=\"active\">Downloads</a>\n      <button mat-button [matMenuTriggerFor]=\"galleryMenu\">Gallery Menu</button>\n      <mat-menu #galleryMenu=\"matMenu\">\n        <button mat-menu-item routerLink=\"/\" >Gallery Home</button>\n        <hr>\n        <button mat-menu-item routerLink=\"/videos\" >Video Gallery</button>\n        <button mat-menu-item routerLink=\"/pictures\">Picture Gallery</button>\n      </mat-menu>\n      <a mat-button routerLink=\"/about\" routerLinkActive=\"active\">About</a>\n      <span class=\"fill-space\"></span>\n      <a mat-button routerLink=\"/\" routerLinkActive=\"active\" (click)=\"auth.authLogout()\">Logout</a>\n  </mat-toolbar>\n</div>\n"

/***/ }),

/***/ "./src/app/header/header.component.scss":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-toolbar {\n  margin-bottom: 0; }\n"

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
    HeaderComponent.prototype.ngOnInit = function () {
    };
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

module.exports = "<div *ngIf=\"!auth.isAuthenticated()\">\n  <video *ngIf=\"auth.hasLoggedInBefore()\" autoplay muted loop class=\"BackImage\">\n    <source src=\"assets/video/Beach_Waves_Sunset-480p.mp4\" type=\"video/mp4\">\n  </video>\n  <img *ngIf=\"!auth.hasLoggedInBefore()\" src=\"assets/images/Mountain.jpg\" class=\"BackImage\" fxFlexFill>\n  <div class=\"login-container\" fxLayoutAlign=\"center center\">\n        <!-- fxLayout=\"row\"\n        fxLayout.sm=\"column\"\n        fxLayout.xs=\"column\" -->\n      <form novalidate #loginForm=\"ngForm\" class=\"login-form\" fxLayout=\"column\">\n        <mat-toolbar class=\"toolbar\">\n          <h3 align=\"center\">Login to {{CFG.const.login.title}}</h3>\n        </mat-toolbar>\n        <mat-form-field>\n          <input matInput maxlength=\"20\" placeholder=\"Username\" type=\"text\" [(ngModel)]=\"auth.user.username\" #username=\"ngModel\" name=\"username\" required>\n          <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n          <mat-hint>\n            <span [hidden]=\"username.pristine\">\n              <span [hidden]=\"!username.errors?.required\">** Username is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <mat-form-field>\n          <input matInput maxlength=\"30\" placeholder=\"Password\" [type]=\"hide ? 'password' : 'text'\" ngModel name=\"password\" #password=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hide = !hide\">{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"password.pristine\">\n              <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <div fxLayout=\"row\">\n          <button mat-raised-button color=\"primary\" type=\"button\" (click)=\"openRegisterDialog()\">Register New User</button>\n          <span class=\"fill-space\"></span>\n          <button mat-raised-button type=\"submit\"\n             color=\"primary\" [disabled]=\"loginForm.form.invalid\" (click)=\"onLogin(password.value)\" cdkFocusInitial>Login</button>\n        </div>\n        <a id=\"forgotCredentials\" align=\"center\" (click)=\"openForgotDialog()\">Forgot username or password</a>\n      </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/login/login.component.scss":
/*!********************************************!*\
  !*** ./src/app/login/login.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".BackImage {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-filter: opacity(60%);\n          filter: opacity(60%);\n  z-index: -1;\n  background-position: right;\n  background-size: cover; }\n\n.login-container {\n  min-height: 100vh; }\n\n.login-form {\n  min-width: 300px;\n  background-color: white;\n  border-radius: 5px;\n  border: 1px;\n  border-color: black;\n  border-style: ridge;\n  padding: 10px; }\n\n#forgotCredentials {\n  padding-top: 10px;\n  color: indigo; }\n\na {\n  cursor: pointer; }\n"

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
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app.config */ "./src/app/app.config.ts");
/* harmony import */ var _classes_user_classes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_classes/user-classes */ "./src/app/_classes/user-classes.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../forgot-dialog/forgot-dialog.component */ "./src/app/forgot-dialog/forgot-dialog.component.ts");
/* harmony import */ var _alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../alert-message-dialog/alert-message-dialog.component */ "./src/app/alert-message-dialog/alert-message-dialog.component.ts");
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
    function LoginComponent(CFG, auth, dialog, router) {
        this.CFG = CFG;
        this.auth = auth;
        this.dialog = dialog;
        this.router = router;
        this.hide = true;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.auth.user = new _classes_user_classes__WEBPACK_IMPORTED_MODULE_4__["User"];
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
    LoginComponent.prototype.onLogin = function (password) {
        var _this = this;
        // Note: I stopped binding password to auth.user.password since the auth service 
        // changes that value outside the form.  Keeping it unbound keeps the UI clean.
        this.auth.user.password = password;
        this.auth.authLogin().subscribe(function () {
            console.log("User " + _this.auth.user['username'] + " is logged in");
            _this.router.navigate(['/gallery']);
        }, function (err) {
            var alertMessage = 'Problem logging on: ' + err.error;
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_8__["AlertMessageDialogComponent"], {
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
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_8__["AlertMessageDialogComponent"], {
                width: '400px',
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function (err) {
            var alertMessage = 'Email "' + _this.auth.user['email'] + '" was not found!';
            var dialogRef = _this.dialog.open(_alert_message_dialog_alert_message_dialog_component__WEBPACK_IMPORTED_MODULE_8__["AlertMessageDialogComponent"], {
                data: { alertMessage: alertMessage }
            });
            dialogRef.afterClosed().subscribe(function (result) { });
        }, function () { });
    };
    LoginComponent.prototype.openRegisterDialog = function () {
        var dialogRef = this.dialog.open(_register_register_component__WEBPACK_IMPORTED_MODULE_6__["RegisterComponent"], {
            //      width: '600px',
            data: { name: this.auth.user['username'] }
        });
    };
    LoginComponent.prototype.openForgotDialog = function () {
        var dialogRef = this.dialog.open(_forgot_dialog_forgot_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ForgotDialogComponent"], {
            data: { name: this.auth.user['email'] }
        });
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/login/login.component.scss")]
        }),
        __metadata("design:paramtypes", [_app_config__WEBPACK_IMPORTED_MODULE_3__["AppConfig"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"],
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

module.exports = "<div class=\"register-container\" fxLayoutAlign=\"center center\">\n      <!-- fxLayout=\"row\"\n      fxLayout.sm=\"column\"\n      fxLayout.xs=\"column\" -->\n    <form novalidate #registerForm=\"ngForm\" class=\"register-form\" fxLayout=\"column\" (ngSubmit)=\"onRegisterClick()\">\n      <mat-toolbar class=\"toolbar\">\n        <h3 align=\"center\">Register a new user</h3>\n      </mat-toolbar>\n      <mat-form-field>\n        <input matInput maxlength=\"30\" placeholder=\"Full Name\" type=\"text\" [(ngModel)]=\"auth.user.name\" #name=\"ngModel\" name=\"name\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"name.pristine\">\n            <span [hidden]=\"!name.errors?.required\">** Full Name is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <mat-form-field>\n        <input matInput maxlength=\"20\" placeholder=\"Choose a username\" type=\"text\" [(ngModel)]=\"auth.user.username\" #username=\"ngModel\" name=\"username\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"username.pristine\">\n            <span [hidden]=\"!username.errors?.required\">** Username is required **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <div fxLayout=\"column\" ngModelGroup=\"passGroup\" equal>  <!-- This div encloses a formGroup - making collection of two inputs \"password\" and \"retry\" -->\n        <mat-form-field>\n          <input matInput minlength=\"5\" maxlength=\"30\" placeholder=\"Choose a password\" [type]=\"hidePass ? 'password' : 'text'\"\n             [(ngModel)]=\"auth.user.password\" name=\"password\" #password=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hidePass = !hidePass\">{{hidePass ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"password.pristine\">\n              <span [hidden]=\"!password.errors?.required\">** Password is required **</span>\n              <span [hidden]=\"!password.errors?.minlength\">** Minimum length is 5 characters **</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n        <mat-form-field>\n          <input matInput minlength=\"5\" maxlength=\"30\" placeholder=\"Verify the password\" [type]=\"hideRetype ? 'password' : 'text'\"\n             ngModel name=\"retype\" #retype=\"ngModel\" required>\n          <mat-icon matSuffix (click)=\"hideRetype = !hideRetype\">{{hideRetype ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-hint>\n            <span [hidden]=\"retype.pristine\">\n              <span [hidden]=\"!retype.errors?.required\">** Verification of the password is required **</span>\n              <span [hidden]=\"!retype.errors?.minlength\">** Minimum length is 5 characters **</span>\n              <span [hidden]=\"!registerForm.form.hasError('equal', 'passGroup')\"> - Passwords do not match</span>\n            </span>\n          </mat-hint>\n        </mat-form-field>\n      </div>\n      <mat-form-field>\n        <input matInput minlength=\"5\" maxlength=\"40\" placeholder=\"Email\" type=\"email\" [(ngModel)]=\"auth.user.email\" #email=\"ngModel\" name=\"email\" required>\n        <!-- <mat-hint align=\"end\">{{input.value?.length || 0}}/20</mat-hint> -->\n        <mat-hint>\n          <span [hidden]=\"email.pristine\">\n            <span [hidden]=\"!email.errors?.required\">** email is required **</span>\n            <span [hidden]=\"!email.errors?.minlength\">** Minimum length is 5 characters **</span>\n          </span>\n        </mat-hint>\n      </mat-form-field>\n      <div fxLayout=\"row\">\n        <button mat-button mat-dialog-close>Cancel</button>\n        <span class=\"fill-space\"></span>\n        <button mat-raised-button type=\"submit\" color=\"primary\" [disabled]=\"registerForm.form.invalid\">Register</button>\n      </div>\n    </form>\n</div>\n"

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
/*! exports provided: RegisterComponent, EqualDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqualDirective", function() { return EqualDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _classes_user_classes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_classes/user-classes */ "./src/app/_classes/user-classes.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
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
        this.hideRetype = true;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.auth.user = new _classes_user_classes__WEBPACK_IMPORTED_MODULE_2__["User"];
    };
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
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], RegisterComponent);
    return RegisterComponent;
}());

// Set up the directive for a custom form validation - "password" and "retype" password.
// Using template driven forms, so need a custom @Directive to create a selector for use
// in the form.  Note: this selector is applied as an attribute in the form GROUP 
// (note the ngModelGroup="passGroup" in the template).  That way all the formGroup input
// fields will be sent in the FormControl object injected into the function within the 
// factory - yeah, the syntax is a bit confusing for this...
var EqualDirective = /** @class */ (function () {
    function EqualDirective() {
        this.validator = validateEqualFactory();
    }
    EqualDirective_1 = EqualDirective;
    EqualDirective.prototype.validate = function (c) {
        return this.validator(c);
    };
    EqualDirective = EqualDirective_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[equal]',
            providers: [{ provide: _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NG_VALIDATORS"], useExisting: EqualDirective_1, multi: true }]
        })
        // This class has one property, a constructor that sets that property, and the required
        // validate() function (required by the Validator interface).
        ,
        __metadata("design:paramtypes", [])
    ], EqualDirective);
    return EqualDirective;
    var EqualDirective_1;
}());

// This factory function simply returns a function.  The inner function is the one that
// has the FormGroup object injected into it - note it is a FormGroup object because we
// need both the password AND the retry passed to us (these are the only two elements in
// the ngModelGroup="passGroup") in order to compare them.  This can be used generically
// though, so I mapped password to first and retry to second.
function validateEqualFactory() {
    return function (c) {
        var _a = Object.keys(c.value || {}), first = _a[0], second = _a[1]; // Deconstruct array syntax
        var valid = (c.value[first] === c.value[second]);
        return (valid) ? null : { equal: { valid: false } };
    };
}


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