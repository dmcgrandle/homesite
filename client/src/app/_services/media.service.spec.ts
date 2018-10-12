import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { MediaService } from './media.service';
import { PhotoAlbum, Photo } from '../_classes/photo-classes';
import { VideoAlbum, Video } from '../_classes/video-classes';
import { UrlSegment } from '@angular/router';

describe('MediaService', () => {
    let media: MediaService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MediaService]
        });
        media = TestBed.get(MediaService);
        httpMock = TestBed.get(HttpTestingController); 
    });

    it('should be createable', () => expect(media).toBeTruthy());

    describe('Photo Methods', () => {
        it('should successfully get a photo using an id', async(() => {
            const tPhoto: Photo = { _id: 1, filename: 'A', fullPath: 'B', thumbPath: 'C', caption: 'D' };
            media.getPhotoById(1).subscribe(photo => expect(photo).toEqual(tPhoto));
            let req = httpMock.expectOne('/api/photos/photo-by-id/1');
            expect(req.request.method).toEqual('GET');
            req.flush(tPhoto);
        }));
        it('should successfully get an array of photos using an array of ids', async(() => {
            const tPhotoArray: Photo[] = [
                { _id: 1, filename: 'A', fullPath: 'B', thumbPath: 'C', caption: 'D' },
                { _id: 2, filename: 'E', fullPath: 'F', thumbPath: 'G', caption: 'H' }
            ];
            media.getPhotosByIdArray([1,2]).subscribe(photos => expect(photos).toEqual(tPhotoArray));
            let req = httpMock.expectOne('/api/photos/photos/(1+2)');
            expect(req.request.method).toEqual('GET');
            req.flush(tPhotoArray);
        }));
        it('should successfully get an array of thumbs using an array of ids', async(() => {
            const tThumbArray: string[] = [ 't1', 't2' ];
            media.getThumbsByIdArray([1,2]).subscribe(thumbs => expect(thumbs).toEqual(tThumbArray));
            let req = httpMock.expectOne('/api/photos/thumbs/(1+2)');
            expect(req.request.method).toEqual('GET');
            req.flush(tThumbArray);
        }));
        describe('Photo Album Methods', () => {
            const tPhotoAlbum: PhotoAlbum = { 
                _id: 1, name: 'E', path: 'F', description: 'G',  photoIds: [], albumIds: [1,2,3],
                featuredMedia: { _id: 1, filename: 'A', fullPath: 'B', thumbPath: 'C', caption: 'D' },
            };
            it('should successfully get a photo album using an id', async(() => {
                media.getPhotoAlbumById(1).subscribe(album => expect(album).toEqual(tPhotoAlbum));
                let req = httpMock.expectOne('/api/photos/album-by-id/1');
                expect(req.request.method).toEqual('GET');
                req.flush(tPhotoAlbum);
            }));
            it('should successfully get a photo album using the root path', async(() => {
                media.getPhotoAlbumByPath('photoAlbums').subscribe(album => expect(album).toEqual(tPhotoAlbum));
                let req = httpMock.expectOne('/api/photos/album-by-path/()');
                expect(req.request.method).toEqual('GET');
                req.flush(tPhotoAlbum);
            }));
            it('should successfully get a photo album using a non-root path', async(() => {
                media.getPhotoAlbumByPath('A/B/C').subscribe(album => expect(album).toEqual(tPhotoAlbum));
                let req = httpMock.expectOne('/api/photos/album-by-path/(A+B+C)');
                expect(req.request.method).toEqual('GET');
                req.flush(tPhotoAlbum);
            }));
            it('should successfully get an array of photo albums using an array of ids', async(() => {
                const tPhotoAlbums: PhotoAlbum[] = [ tPhotoAlbum, tPhotoAlbum ];
                media.getPhotoAlbumsByIdArray([1,2]).subscribe(albums => expect(albums).toEqual(tPhotoAlbums));
                let req = httpMock.expectOne('/api/photos/albums/(1+2)');
                expect(req.request.method).toEqual('GET');
                req.flush(tPhotoAlbums);
            }));
            describe('Photo Album Methods via URL', () => {
                const tSegments: Observable<UrlSegment[]> = of([
                    new UrlSegment('dir1', {}), 
                    new UrlSegment('dir2', {}), 
                    new UrlSegment('dir3', {})
                ]);
                it('should successfully get a photo album by using an URL', async(() => {
                    media.getPhotoAlbumByURL(tSegments).subscribe(album => {
                        expect(album).toEqual(tPhotoAlbum);
                        expect(media.curPhotoAlbum).toEqual(tPhotoAlbum);
                    });
                    let req = httpMock.expectOne('/api/photos/album-by-path/(dir1+dir2+dir3)');
                    expect(req.request.method).toEqual('GET');
                    req.flush(tPhotoAlbum);
                }));
                it('should successfully get an array of photo albums by using an URL', async(() => {
                    const tPhotoAlbums: PhotoAlbum[] = [tPhotoAlbum, tPhotoAlbum];
                    media.getPhotoAlbumsByURL(tSegments).subscribe(albums => {
                        expect(albums).toEqual(tPhotoAlbums);
                        expect(media.curPhotoAlbum).toEqual(tPhotoAlbum);
                    });
                    // This method actually makes TWO http calls, so mock both.
                    let req1 = httpMock.expectOne('/api/photos/album-by-path/(dir1+dir2+dir3)');
                    expect(req1.request.method).toEqual('GET');
                    req1.flush(tPhotoAlbum);
                    let req2 = httpMock.expectOne('/api/photos/albums/(1+2+3)');
                    expect(req2.request.method).toEqual('GET');
                    req2.flush(tPhotoAlbums);
                }));
            });
        });
    });
    describe('Video Methods', () => {
        const tVideos: Video[] = [
            { _id: 1, filename: 'A', fullPath: 'B', posterPath: 'C', caption: 'D' },
            { _id: 2, filename: 'E', fullPath: 'F', posterPath: 'G', caption: 'H' }
        ];
        it('should successfully get a video using its id', async(() => {
            media.getVideoById(1).subscribe(video => expect(video).toEqual(tVideos[0]));
            let req = httpMock.expectOne('/api/videos/video-by-id/1');
            expect(req.request.method).toEqual('GET');
            req.flush(tVideos[0]);
        }));
        it('should successfully get a video using its path', async(() => {
            media.getVideoByPath('path/to/video.mp4').subscribe(video => expect(video).toEqual(tVideos[0]));
            let req = httpMock.expectOne('/api/videos/video-by-path/(path+to+video.mp4)');
            expect(req.request.method).toEqual('GET');
            req.flush(tVideos[0]);
        }));
        it('should successfully get videos using an array of ids', async(() => {
            media.getVideosByIdArray([1,2]).subscribe(videos => expect(videos).toEqual(tVideos));
            let req = httpMock.expectOne('/api/videos/videos/(1+2)');
            expect(req.request.method).toEqual('GET');
            req.flush(tVideos);
        }));
        it('should successfully get video posters using an array of ids', async(() => {
            const tPosterArray: string[] = [ '/path/to/poster1.jpg', 'path/to/poster2.jpg' ];
            media.getPostersByIdArray([1,2]).subscribe(posters => expect(posters).toEqual(tPosterArray));
            let req = httpMock.expectOne('/api/videos/posters/(1+2)');
            expect(req.request.method).toEqual('GET');
            req.flush(tPosterArray);
        }));
        describe('Video Album Methods', () => {
            const tVideoAlbum: VideoAlbum = { 
                _id: 1, name: 'E', path: 'F', description: 'G',  videoIds: [], albumIds: [1,2,3],
                featuredMedia: tVideos[0],
            };
            it('should successfully get a video album using the root path', async(() => {
                media.getVideoAlbumByPath('videoAlbums').subscribe(album => expect(album).toEqual(tVideoAlbum));
                let req = httpMock.expectOne('/api/videos/album-by-path/()');
                expect(req.request.method).toEqual('GET');
                req.flush(tVideoAlbum);
            }));
            it('should successfully get a video album using a non-root path', async(() => {
                media.getVideoAlbumByPath('A/B/C').subscribe(album => expect(album).toEqual(tVideoAlbum));
                let req = httpMock.expectOne('/api/videos/album-by-path/(A+B+C)');
                expect(req.request.method).toEqual('GET');
                req.flush(tVideoAlbum);
            }));
            it('should successfully get an array of video albums using an array of ids', async(() => {
                const tVideoAlbums: VideoAlbum[] = [ tVideoAlbum, tVideoAlbum ];
                media.getVideoAlbumsByIdArray([1,2]).subscribe(albums => expect(albums).toEqual(tVideoAlbums));
                let req = httpMock.expectOne('/api/videos/albums/(1+2)');
                expect(req.request.method).toEqual('GET');
                req.flush(tVideoAlbums);
            }));
            describe('Video Album Methods via URL', () => {
                const tSegments: Observable<UrlSegment[]> = of([
                    new UrlSegment('dir1', {}), 
                    new UrlSegment('dir2', {}), 
                    new UrlSegment('dir3', {})
                ]);
                it('should successfully get a video album by using an URL', async(() => {
                    media.getVideoAlbumByURL(tSegments).subscribe(album => {
                        expect(album).toEqual(tVideoAlbum);
                        expect(media.curVideoAlbum).toEqual(tVideoAlbum);
                    });
                    let req = httpMock.expectOne('/api/videos/album-by-path/(dir1+dir2+dir3)');
                    expect(req.request.method).toEqual('GET');
                    req.flush(tVideoAlbum);
                }));
                it('should successfully get an array of video albums by using an URL', async(() => {
                    const tVideoAlbums: VideoAlbum[] = [ tVideoAlbum, tVideoAlbum ];
                    media.getVideoAlbumsByURL(tSegments).subscribe(albums => {
                        expect(albums).toEqual(tVideoAlbums);
                        expect(media.curVideoAlbum).toEqual(tVideoAlbum);
                    });
                    // This method actually makes TWO http calls, so mock both.
                    let req1 = httpMock.expectOne('/api/videos/album-by-path/(dir1+dir2+dir3)');
                    expect(req1.request.method).toEqual('GET');
                    req1.flush(tVideoAlbum);
                    let req2 = httpMock.expectOne('/api/videos/albums/(1+2+3)');
                    expect(req2.request.method).toEqual('GET');
                    req2.flush(tVideoAlbums);
                }));
                it('should successfully get a video by using an URL', async(() => {
                    media.getVideoByURL(tSegments).subscribe(video => expect(video).toEqual(tVideos[0]));
                    let req = httpMock.expectOne('/api/videos/video-by-path/(dir1+dir2+dir3)');
                    expect(req.request.method).toEqual('GET');
                    req.flush(tVideos[0]);
                }));
            });
        });
    }); 
    afterEach(() => httpMock.verify());
});
