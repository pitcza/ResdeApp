import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../modules/material.module';
import { AllPostComponent } from './components/all-post/all-post.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { DisplayImagesComponent } from './components/forlandingphotos/display-images/display-images.component';
import { ImagesHistoryComponent } from './components/forlandingphotos/images-history/images-history.component';
import { LoadingComponent } from './components/loading/loading.component';
import { EditLatestComponent } from './components/forlandingphotos/edit-latest/edit-latest.component';
import { MyBarangayComponent } from './components/my-barangay/my-barangay.component';
import { CreatePostComponent } from './components/my-barangay/create-post/create-post.component';
import { ViewPostComponent } from './components/my-barangay/view-post/view-post.component';
import { EditPostComponent } from './components/my-barangay/edit-post/edit-post.component';
import { ReportedPostsComponent } from './components/reported-posts/reported-posts.component';
import { ViewComponent } from './components/all-post/view/view.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AllPostComponent,
    AnnouncementComponent,
    ReportsComponent,
    UsersComponent,
    DisplayImagesComponent,
    ImagesHistoryComponent,
    LoadingComponent,
    EditLatestComponent,
    MyBarangayComponent,
    CreatePostComponent,
    ViewPostComponent,
    ViewComponent,
    ReportedPostsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
  ]
})
export class AdminModule { }
