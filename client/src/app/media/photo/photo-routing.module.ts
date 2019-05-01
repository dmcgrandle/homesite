import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from 'media/albums/albums.component';
import { PhotosComponent } from './photos/photos.component';
import { AuthService } from '../../user/_services/auth.service';

const routes: Routes = [
    { path: 'albums', component: AlbumsComponent, canActivate: [AuthService] },
    {
        path: 'albums',
        children: [{ path: '**', component: AlbumsComponent, canActivate: [AuthService] }]
    },
    {
        path: 'photos',
        children: [{ path: '**', component: PhotosComponent, canActivate: [AuthService] }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhotoRoutingModule {}
