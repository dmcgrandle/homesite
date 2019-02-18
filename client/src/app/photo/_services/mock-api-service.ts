import { of } from 'rxjs';

import { Album, Photo } from '../_helpers/classes';

export const tPhoto: Photo = {
    _id: 0,
    filename: 'tFile',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
}
export const tAlbum: Album = {
    _id: 1,
    name: 'tAlbum',
    path: 'assets/tests',
    description: 'test Photo Album',
    featuredMedia: tPhoto,
    photoIds: [0, 1, 2],
    albumIds: [2, 3, 4]
}

export class MockAPIService {
    curPhoto: Photo = tPhoto;
    curAlbum: Album = tAlbum;

    getAlbumsByURL(url) {
        return of([tAlbum, tAlbum, tAlbum]);
    }
    getAlbumsByIdArray(url) {
        return of([tAlbum, tAlbum, tAlbum]);
    }
}