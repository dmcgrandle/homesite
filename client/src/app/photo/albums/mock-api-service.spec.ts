import { of } from 'rxjs';

import { Album, Photo } from '../_helpers/classes';

export const tPhoto: Photo = {
    _id: 0,
    filename: 'tFile',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
}
export const tAlbum: Album = {
    _id: 0,
    name: 'tAlbum',
    path: 'tAlbum',
    description: 'test Photo Album',
    featuredMedia: tPhoto,
    photoIds: [0],
    albumIds: [1, 2, 3]
}
export const tAlbum1: Album = {
    _id: 1,
    name: 'tAlbum1',
    path: 'tAlbum/tAlbum1',
    description: 'test Photo Album 1',
    featuredMedia: tPhoto,
    photoIds: [0],
    albumIds: [4]
}
export const tAlbum2: Album = {
    _id: 2,
    name: 'tAlbum2',
    path: 'tAlbum/tAlbum2',
    description: 'test Photo Album 2',
    featuredMedia: tPhoto,
    photoIds: [0],
    albumIds: []
}
export const tAlbum3: Album = {
    _id: 3,
    name: 'tAlbum3',
    path: 'tAlbum/tAlbum3',
    description: 'test Photo Album 3',
    featuredMedia: tPhoto,
    photoIds: [],
    albumIds: []
}
export const tAlbum4: Album = {
    _id: 4,
    name: 'tAlbum4',
    path: 'tAlbum/tAlbum1/tAlbum4',
    description: 'test Photo Album 4',
    featuredMedia: tPhoto,
    photoIds: [0],
    albumIds: []
}

export class MockAPIService {
    curPhoto: Photo = tPhoto;
    curAlbum: Album = tAlbum;

    getAlbumsByURL = jasmine.createSpy().and.returnValue(
        of([tAlbum1, tAlbum2, tAlbum3])
    );
    getAlbumsByIdArray =jasmine.createSpy().and.returnValue(
        of([tAlbum4])
    )
}