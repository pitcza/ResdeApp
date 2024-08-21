import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LikedpostsComponent } from './components/likedposts/likedposts.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./components/homepage/homepage.module').then(m => m.HomepageModule) },
  { path: 'likes', component: LikedpostsComponent },
  { path: 'uploads', loadChildren: () => import('./components/uploads/uploads.module').then(m => m.UploadsModule) },
  { path: 'user-info', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
