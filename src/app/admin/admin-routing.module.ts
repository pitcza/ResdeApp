import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { MyBarangayComponent } from './components/my-barangay/my-barangay.component';
import { AllPostComponent } from './components/all-post/all-post.component';
import { ReportedPostsComponent } from './components/reported-posts/reported-posts.component';
import { LogsComponent } from './components/logs/logs.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-barangay', component: MyBarangayComponent},
  { path: 'announcement', component: AnnouncementComponent},
  { path: 'all-post', component: AllPostComponent },
  { path: 'reported-posts', component: ReportedPostsComponent },
  { path: 'reports', component: ReportsComponent},
  { path: 'users', component: UsersComponent},
  { path: 'logs', component: LogsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
