import { of } from 'rxjs';

import { PhotoAlbum, Photo } from '../_classes/photo-classes';
import { VideoAlbum, Video } from '../_classes/video-classes';

export const tPhoto: Photo = {
    _id: 0,
    filename: 'tFile',
    fullPath: 'assets/tests/lion.jpg',
    thumbPath: 'assets/tests/lion-sml.jpg'
}
export const tPhotoAlbum: PhotoAlbum = {
    _id: 1,
    name: 'tPhotoAlbum',
    path: 'assets/tests',
    description: 'test Photo Album',
    featuredMedia: tPhoto,
    photoIds: [0, 1, 2],
    albumIds: [2, 3, 4]
}
export const tVideo: Video = {
    _id: 0,
    filename: 'tFile',
    fullPath: 'assets/tests/lion.jpg',
    posterPath: 'assets/tests/lion-sml.jpg'
}
export const tVideoAlbum: VideoAlbum = {
    _id: 1,
    name: 'tVideoAlbum',
    path: 'assets/tests',
    description: 'test Video Album',
    featuredMedia: tVideo,
    videoIds: [0, 1, 2],
    albumIds: [2, 3, 4]
}

export class MockMediaService {
    curPhoto: Photo = tPhoto;
    curPhotoAlbum: PhotoAlbum = tPhotoAlbum;
    curVideo: Video = tVideo;
    curVideoAlbum: VideoAlbum = tVideoAlbum;

    getPhotoAlbumsByURL(url) {
        return of([tPhotoAlbum, tPhotoAlbum, tPhotoAlbum]);
    }
    getPhotoAlbumsByIdArray(url) {
        return of([tPhotoAlbum, tPhotoAlbum, tPhotoAlbum]);
    }
}