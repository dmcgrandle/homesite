import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'photo', loadChildren: './photo/photo.module#PhotoModule' },
    { path: 'video', loadChildren: './video/video.module#VideoModule' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MediaRoutingModule {}
