import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

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
  photosDisplayName: string;

  constructor(private    media: MediaService,
              private    route: ActivatedRoute,
              private   router: Router, 
              public    dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {
    // this observable changes on init, or when nav button hit (back or fwd)
    this.media.getPhotoAlbumsByURL(this.route.url).subscribe(
      (albums) => {
        this.displayAlbums = albums;
        if (this.media.curPhotoAlbum._id > 0) {
          this.photosDisplayName = this.media.curPhotoAlbum.name;
        } else {
          this.photosDisplayName = ""
        }
      },
      (err) => this.errAlert('Problem getting albums!', err)
    );
  };

  public updateDisplayAlbum(album: Album) {
    this.media.curPhotoAlbum = album; // go down one level (directory).
    if (album.albums.length > 0) {// means this album contains other albums
      this.media.getPhotoAlbumsByIdArray(album.albums).subscribe( 
        (albums) => { // get the albums array for this new album
          this.displayAlbums = albums; // set albums to display
          const url = 'albums' + this.router.createUrlTree([album.path]).toString();
          this.location.go(url); // Update the URL in the browser window without navigating.
        },
        (err) => this.errAlert('Problem getting albums!', err)
      );
    } else { // Not an album of albums!  So nav to photos ...
      this.navToPhotos(album);
    } 
  };

  public navToPhotos(album: Album) {
    return this.router.navigate(['/photos/' + album.path]);
  }

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
