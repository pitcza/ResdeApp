import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'announcement', component: AnnouncementComponent},
  { path: 'pendings', loadChildren: () => import('./components/pendings/pendings.module').then(m => m.PendingsModule) },
  { path: 'all-post', loadChildren: () => import('./components/all-post/all-post.module').then(m => m.AllPostModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
