import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject, BehaviorSubject, pipe, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';

import { MediaService } from '../_services/media.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { Album, Photo } from '../_classes/photo-classes';

@Component({
  selector: 'app-gallery-photo-albums',
  templateUrl: './gallery-photo-albums.component.html',
  styleUrls: ['./gallery-photo-albums.component.scss']
})
export class GalleryPhotoAlbumsComponent implements OnInit {

  displayAlbums : Array<Album>;

  constructor(private media: MediaService,
              private route: ActivatedRoute,
              private router: Router, 
              public  dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {
    // this observable changes on init, or when nav button hit (back or fwd)
//    this.route.url.subscribe(
//      (segments) => this.newAlbumFetch(segments.join('/')));
    this.media.getAlbumsByURL(this.route.url).subscribe(
      (albums) => this.displayAlbums = albums,
      (err) => this.errAlert('Problem getting albums!', err)
    );
  };

  public updateDisplayAlbumOrNavToPhotos(album: Album) {
    this.media.curAlbum = album; // go down one level (directory).
    if (album.albums.length > 0) {// means this album contains other albums
      this.media.getAlbums(album.albums).subscribe( // get the albums array for this new album
        (albums) => {
          this.displayAlbums = albums; // set albums to display
          const url = 'albums' + this.router.createUrlTree([album.path]).toString();
          this.location.go(url); // Update the URL in the browser window without navigating.
        },
        (err) => this.errAlert('Problem getting albums!', err)
      );
    } else { // not an album of albums!  Display photos
      this.router.navigate(['/photos/' + album.path]); 
    } 
  };

  /*
  private newAlbumFetch(path: string) {
    this.media.curAlbum = new Album;
    if (path == 'albums') path = ''; // 'albums' is our root path.
    this.media.getAlbumByPath(path).subscribe(
      (album) => this.newAlbumsFetch(album),
      (err) => this.errAlert('Problem getting first album!', err),
      () => {}
    );
  }

  private newAlbumsFetch(album) {
    this.media.curAlbum = album; 
    this.media.getAlbums(this.media.curAlbum.albums).subscribe(
      (albums) => this.displayAlbums = albums,
      (err) => this.errAlert('Problem getting albums!', err)
    );
  }
  */

  private errAlert(msg: string, err) {
    const alertMessage = msg + err.error;
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
      width: '400px',
      data: {alertMessage: alertMessage}
    });
    dialogRef.afterClosed().subscribe(result => {});
    console.log(err);
    this.router.navigate(['/gallery']);
  };

}
