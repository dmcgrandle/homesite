import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { AlertMessageDialogComponent } from '../alert-message-dialog/alert-message-dialog.component';
import { Album, Photo } from '../_classes/photo-classes';
import { error } from '../../../node_modules/protractor';
//import { ROOT_ALBUMLIST } from '../_classes/photo-albums-temp';

@Component({
  selector: 'app-gallery-photo-albums-list',
  templateUrl: './gallery-photo-albums-list.component.html',
  styleUrls: ['./gallery-photo-albums-list.component.scss']
})
export class GalleryPhotoAlbumsListComponent implements OnInit {

  currentAlbum : Album;
  currentAlbums : Array<Album>;

  constructor(private auth: AuthService, 
              private router: Router, 
              public dialog: MatDialog,) { }

  ngOnInit() {
    this.currentAlbum = new Album;
    this.auth.getAlbum(0).subscribe(
      (album) => {
        console.log("Album 0 is :" + JSON.stringify(album, null, 2));
//          this.router.navigate(['/gallery']);
        this.currentAlbum = album;
        this.auth.getAlbums(this.currentAlbum.albums).subscribe(
          (albums) => this.currentAlbums = albums,
          (err) => this.errAlert('Problem getting albums!', err)
        );
      },
      (err) => this.errAlert('Problem getting album zero!', err),
      () => {}
    );
//    this.currentAlbum = ROOT_ALBUMLIST; // first time start with the root list
 }

  navToAlbum(album: Album) {
    console.log('album is ' + JSON.stringify(album));
    if (album.albums) {// means this album contains other albums
      this.currentAlbum = album;
      this.auth.getAlbums(album.albums).subscribe(
        (albums) => this.currentAlbums = albums,
        (err) => this.errAlert('Problem getting albums!', err)
      );
    } else { // not an album of albums!  Navigate to 
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
