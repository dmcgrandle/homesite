import { Component, OnInit } from '@angular/core';

import { PhotoAlbum, PhotoAlbumList } from '../_classes/photo-classes';
import { ROOT_ALBUMLIST } from '../_classes/photo-albums-temp';

@Component({
  selector: 'app-gallery-photo-albums-list',
  templateUrl: './gallery-photo-albums-list.component.html',
  styleUrls: ['./gallery-photo-albums-list.component.scss']
})
export class GalleryPhotoAlbumsListComponent implements OnInit {

  currentAlbumList : PhotoAlbumList;

  constructor() {
    this.currentAlbumList = ROOT_ALBUMLIST; // first time start with the root list
   }

  ngOnInit() {
  }

  navToListItem(listItem: PhotoAlbum | PhotoAlbumList) {
    console.log('listItem is ' + JSON.stringify(listItem));
  };

}
