import { TestBed, async } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { UrlSegment } from '@angular/router';

import { APIService } from './api.service';
import { PhotoAlbum, Photo } from '../_helpers/classes';

describe('Photo Module: APIService', () => {
    let api: APIService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [APIService]
        });
        api = TestBed.get(APIService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should be createable', () => expect(api).toBeTruthy());

    it('should successfully get a photo using an id', async(() => {
        const tPhoto: Photo = {
            _id: 1,
            filename: 'A',
            fullPath: 'B',
            thumbPath: 'C',
            caption: 'D'
        };
        api.getPhotoById(1).subscribe(photo => expect(photo).toEqual(tPhoto));
        const req = httpMock.expectOne('/api/photos/photo-by-id/1');
        expect(req.request.method).toEqual('GET');
        req.flush(tPhoto);
    }));
    it('should successfully get an array of photos using an array of ids', async(() => {
        const tPhotoArray: Photo[] = [
            { _id: 1, filename: 'A', fullPath: 'B', thumbPath: 'C', caption: 'D' },
            { _id: 2, filename: 'E', fullPath: 'F', thumbPath: 'G', caption: 'H' }
        ];
        api.getPhotosByIdArray([1, 2]).subscribe(photos =>
            expect(photos).toEqual(tPhotoArray)
        );
        const req = httpMock.expectOne('/api/photos/photos/(1+2)');
        expect(req.request.method).toEqual('GET');
        req.flush(tPhotoArray);
    }));
    it('should successfully get an array of thumbs using an array of ids', async(() => {
        const tThumbArray: string[] = ['t1', 't2'];
        api.getThumbsByIdArray([1, 2]).subscribe(thumbs =>
            expect(thumbs).toEqual(tThumbArray)
        );
        const req = httpMock.expectOne('/api/photos/thumbs/(1+2)');
        expect(req.request.method).toEqual('GET');
        req.flush(tThumbArray);
    }));
    describe('Album Methods', () => {
        const tAlbum: PhotoAlbum = {
            _id: 1,
            name: 'E',
            path: 'F',
            description: 'G',
            mediaIds: [],
            albumIds: [1, 2, 3],
            featuredMedia: {
                _id: 1,
                filename: 'A',
                fullPath: 'B',
                thumbPath: 'C',
                caption: 'D'
            }
        };
        it('should successfully get a photo album using an id', async(() => {
            api.getAlbumById(1).subscribe(album => expect(album).toEqual(tAlbum));
            const req = httpMock.expectOne('/api/photos/album-by-id/1');
            expect(req.request.method).toEqual('GET');
            req.flush(tAlbum);
        }));
        it('should successfully get a photo album using the root path', async(() => {
            api.getAlbumByPath('albums').subscribe(album =>
                expect(album).toEqual(tAlbum)
            );
            const req = httpMock.expectOne('/api/photos/album-by-path/()');
            expect(req.request.method).toEqual('GET');
            req.flush(tAlbum);
        }));
        it('should successfully get a photo album using a non-root path', async(() => {
            api.getAlbumByPath('A/B/C').subscribe(album => expect(album).toEqual(tAlbum));
            const req = httpMock.expectOne('/api/photos/album-by-path/(A+B+C)');
            expect(req.request.method).toEqual('GET');
            req.flush(tAlbum);
        }));
        it('should successfully get an array of photo albums using an array of ids', async(() => {
            const tAlbums: PhotoAlbum[] = [tAlbum, tAlbum];
            api.getAlbumsByIdArray([1, 2]).subscribe(albums =>
                expect(albums).toEqual(tAlbums)
            );
            const req = httpMock.expectOne('/api/photos/albums/(1+2)');
            expect(req.request.method).toEqual('GET');
            req.flush(tAlbums);
        }));
        describe('Photo Album Methods via URL', () => {
            const tSegments: Observable<UrlSegment[]> = of([
                new UrlSegment('dir1', {}),
                new UrlSegment('dir2', {}),
                new UrlSegment('dir3', {})
            ]);
            it('should successfully get a photo album by using an URL', async(() => {
                api.getAlbumByURL(tSegments).subscribe(album => {
                    expect(album).toEqual(tAlbum);
                    expect(api.curAlbum).toEqual(tAlbum);
                });
                const req = httpMock.expectOne(
                    '/api/photos/album-by-path/(dir1+dir2+dir3)'
                );
                expect(req.request.method).toEqual('GET');
                req.flush(tAlbum);
            }));
            it('should successfully get an array of photo albums by using an URL', async(() => {
                const tAlbums: PhotoAlbum[] = [tAlbum, tAlbum];
                api.getAlbumsByURL(tSegments).subscribe(albums => {
                    expect(albums).toEqual(tAlbums);
                    expect(api.curAlbum).toEqual(tAlbum);
                });
                // This method actually makes TWO http calls, so mock both.
                const req1 = httpMock.expectOne(
                    '/api/photos/album-by-path/(dir1+dir2+dir3)'
                );
                expect(req1.request.method).toEqual('GET');
                req1.flush(tAlbum);
                const req2 = httpMock.expectOne('/api/photos/albums/(1+2+3)');
                expect(req2.request.method).toEqual('GET');
                req2.flush(tAlbums);
            }));
        });
    });
    afterEach(() => httpMock.verify());
});
