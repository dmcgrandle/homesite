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
              public dialog: MatDialog,
              private location: Location) { }

              /*
@HostListener('window:popstate', ['$event']) // detects back button pressed in browser
onPopState(event) {
  console.log('Nav (back or forward) button pressed, calling newAlbumDisp()');
  let path = this.route.snapshot.url.join('/');
  this.newAlbumDisp();
} */

ngOnInit() {

//  const id: Observable<string> = this.route.params.pipe(map(p => p.id));
//  const url: Observable<string> = this.route.url.pipe(map(segments => segments.join('')));
  // route.data includes both `data` and `resolve`
  this.route.url.pipe(map(segments => segments.join('/'))).subscribe(
    (path) => { // this is executed on initial call, or when nav button hit (back or fwd)
      console.log('URL changed!  New url is:');
      console.log(path);
      this.newAlbumFetch(path);
    }
  )
/*  const user = route.data.map(d => d.user);
  this.route.params
    .map(params => params['topCategory'])
    .subscribe(topCategory => {
        if (typeof topCategory !== 'undefined' &&
            topCategory !== null
        ) {
            self.UiState.startArrowWasDismised = true;
            self.UiState.selectedTopCategory = topCategory;
        }
    }); */
/*
  console.log('ngOnInit called ...');
  console.log('Number of segments is: ' + this.route.snapshot.url.length);
  for (let i=0;i<this.route.snapshot.url.length;i++) {
    console.log('Path ' + i + ' is: ' + this.route.snapshot.url[i].path);
  }
this.newAlbumFetch(); */
/*  if (!this.route.snapshot.parent.url.length) {
    this.media.getAlbumById(0).subscribe(
      (album) => this.newAlbumDisp(album),
      (err) => this.errAlert('Problem getting first album!', err),
      () => {}
    );
  } 
  else {
      this.media.getAlbumByPath(this.route.snapshot.url.join('/')).subscribe(
        (album) => this.newAlbumDisp(album),
        (err) => this.errAlert('Problem getting first album!', err),
        () => {}
      );
  //this.route.snapshot.pathFromRoot
   } */
    
 }

  updateDisplayAlbumOrNavToPhotos(album: Album) {
    this.media.prevPath += this.media.curAlbum.path; // so we can nav back from /photos
    this.media.curAlbum = album; // go down one level (directory).
    if (album.albums.length > 0) {// means this album contains other albums
      this.media.getAlbums(album.albums).subscribe( // get the albums array for this new album
        (albums) => {
          this.displayAlbums = albums; // set albums to display
          // Construct an url relative to the existing URL - just add the new album.name to the end:
          const url = 'albums' + this.router.createUrlTree([album.path]).toString();
          console.log('url is :');
          console.log(url);
//          const url = this.router.createUrlTree([album.path], {relativeTo: this.route}).toString();
          this.location.go(url); // Update the URL in the browser window without navigating.
        },
        (err) => this.errAlert('Problem getting albums!', err)
      );
    } else { // not an album of albums!  Display photos
      this.router.navigate(['/photos/' + album.path]); 
    } 
  };

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
