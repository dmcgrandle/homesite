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
    path: 'assets/test1',
    description: 'test Photo Album',
    featuredMedia: tPhoto,
    photoIds: [0, 1, 2],
    albumIds: [2, 3, 4]
}
export const tAlbum2: Album = {
    _id: 2,
    name: 'tAlbum2',
    path: 'assets/test2',
    description: 'test Photo Album 2',
    featuredMedia: tPhoto,
    photoIds: [3, 4, 5],
    albumIds: [5, 6, 7]
}

export class MockAPIService {
    curPhoto: Photo = tPhoto;
    curAlbum: Album = tAlbum;

    getAlbumsByURL = jasmine.createSpy().and.returnValue(
        of([tAlbum, tAlbum])
    );
    getAlbumsByIdArray = jasmine.createSpy().and.returnValue(
        of([tAlbum2, tAlbum2])
    )
}