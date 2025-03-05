import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { MyBarangayComponent } from './components/my-barangay/my-barangay.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-barangay', component: MyBarangayComponent},
  { path: 'announcement', component: AnnouncementComponent},
  { path: 'pendings', loadChildren: () => import('./components/pendings/pendings.module').then(m => m.PendingsModule) },
  { path: 'all-post', loadChildren: () => import('./components/all-post/all-post.module').then(m => m.AllPostModule) },
  { path: 'reports', component: ReportsComponent},
  { path: 'users', component: UsersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
