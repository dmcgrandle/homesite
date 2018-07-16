import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { Album, Photo } from '../_classes/photo-classes';
import { error } from 'protractor';

@Component({
  selector: 'app-gallery-photo-albums',
  templateUrl: './gallery-photo-albums.component.html',
  styleUrls: ['./gallery-photo-albums.component.scss']
})
export class GalleryPhotoAlbumsComponent implements OnInit {

  currentAlbum : Album;
  currentAlbums : Array<Album>;
  albumName: string;

  constructor(private auth: AuthService, 
              private route: ActivatedRoute,
              private router: Router, 
              public dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {
    console.log('Number of segments is: ' + this.route.snapshot.url.length);
    for (let i=0;i<this.route.snapshot.url.length;i++) {
      console.log('Segment ' + i + ' is: ' + this.route.snapshot.url[i]);
    }
    console.log(this.route.snapshot.url);
    this.currentAlbum = new Album;
    this.auth.getAlbum(0).subscribe(
      (album) => {
        this.currentAlbum = album;
        this.auth.getAlbums(this.currentAlbum.albums).subscribe(
          (albums) => this.currentAlbums = albums,
          (err) => this.errAlert('Problem getting albums!', err)
        );
      },
      (err) => this.errAlert('Problem getting first album!', err),
      () => {}
    );
 }

  updateDisplayedAlbumOrNavToPhotos(album: Album) {
    if (album.albums) {// means this album contains other albums
      this.currentAlbum = album; // go down one level.
      this.auth.getAlbums(album.albums).subscribe( // get the albums array for this new album
        (albums) => {
          this.currentAlbums = albums; // set albums to display
          // Construct an url relative to the existing URL - just add the new album.name to the end:
          const url = this.router.createUrlTree([album.name], {relativeTo: this.route}).toString();
          this.location.go(url); // Update the URL in the browser window.
        },
        (err) => this.errAlert('Problem getting albums!', err)
      );
    } else { // not an album of albums!  Navigate to photos
      this.router.navigate(['/gallery']);
    }

  };

private errAlert(msg: string, err) {
  const alertMessage = msg + err.error;
  const dialogRef = this.dialog.open(AlertMessageDialogComponent, {
    width: '400px',
    data: {alertMessage: alertMessage}
  });
  dialogRef.afterClosed().subscribe(result => {});
  console.log(err);
  this.router.navigate(['/gallery']);
  }

}
