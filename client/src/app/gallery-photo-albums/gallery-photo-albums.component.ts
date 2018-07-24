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

  constructor(private media: MediaService,
              private route: ActivatedRoute,
              private router: Router, 
              public  dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {
    // this observable changes on init, or when nav button hit (back or fwd)
    this.media.getPhotoAlbumsByURL(this.route.url).subscribe(
      (albums) => this.displayAlbums = albums,
      (err) => this.errAlert('Problem getting albums!', err)
    );
  };

  public updateDisplayAlbumOrNavToPhotos(album: Album) {
    this.media.curPhotoAlbum = album; // go down one level (directory).
    if (album.albums.length > 0) {// means this album contains other albums
      this.media.getPhotoAlbums(album.albums).subscribe( // get the albums array for this new album
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
