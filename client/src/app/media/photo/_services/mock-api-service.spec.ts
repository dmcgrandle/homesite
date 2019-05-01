import { of, BehaviorSubject } from 'rxjs';

import { PhotoAlbum, Photo } from '../_helpers/classes';

export const tPhoto: Photo = {
    _id: 0,
    filename: 'tFile',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
};
export const tPhoto1: Photo = {
    _id: 1,
    filename: 'tFile1',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
};
export const tPhoto2: Photo = {
    _id: 2,
    filename: 'tFile2',
    caption: `It's a lion!`,
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
};
export const tPhoto3: Photo = {
    _id: 3,
    filename: 'tFile3',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
};

export const tAlbum: PhotoAlbum = {
    _id: 0,
    name: 'tAlbum',
    path: 'tAlbum',
    description: 'test Photo Album',
    featuredMedia: tPhoto,
    mediaIds: [0],
    albumIds: [1, 2, 3]
};
export const tAlbum1: PhotoAlbum = {
    _id: 1,
    name: 'tAlbum1',
    path: 'tAlbum/tAlbum1',
    description: 'test Photo Album 1',
    featuredMedia: tPhoto,
    mediaIds: [1, 2, 3],
    albumIds: [4]
};
export const tAlbum2: PhotoAlbum = {
    _id: 2,
    name: 'tAlbum2',
    path: 'tAlbum/tAlbum2',
    description: 'test Photo Album 2',
    featuredMedia: tPhoto,
    mediaIds: [0],
    albumIds: []
};
export const tAlbum3: PhotoAlbum = {
    _id: 3,
    name: 'tAlbum3',
    path: 'tAlbum/tAlbum3',
    description: 'test Photo Album 3',
    featuredMedia: tPhoto,
    mediaIds: [],
    albumIds: []
};
export const tAlbum4: PhotoAlbum = {
    _id: 4,
    name: 'tAlbum4',
    path: 'tAlbum/tAlbum1/tAlbum4',
    description: 'test Photo Album 4',
    featuredMedia: tPhoto,
    mediaIds: [0],
    albumIds: []
};

export class MockAPIService {
    thumbs$ = new BehaviorSubject<Photo[]>([new Photo()]);
    curPhoto: Photo;
    curAlbum: PhotoAlbum;

    /* for AlbumsComponent */
    getAlbumsByURL = jasmine.createSpy().and.returnValue(of([tAlbum1, tAlbum2, tAlbum3]));
    getAlbumsByIdArray = jasmine.createSpy().and.returnValue(of([tAlbum4]));

    /* for PhotosComponent */
    loadThumbs = jasmine.createSpy().and.callFake(() => {
        this.thumbs$.next([tPhoto1, tPhoto2, tPhoto3]);
    });

    getAlbumByURL = jasmine.createSpy().and.callFake(() => {
        this.curAlbum = tAlbum1; // mock the tap() in original service
        return of(tAlbum1);
    });
    getPhotosByIdArray = jasmine
        .createSpy()
        .and.returnValue(of([tPhoto1, tPhoto2, tPhoto3]));
}
