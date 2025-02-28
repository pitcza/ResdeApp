import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../modules/material.module';
import { PendingsComponent } from './components/pendings/pendings.component';
import { PendingsModule } from './components/pendings/pendings.module';
import { AllPostComponent } from './components/all-post/all-post.component';
import { AllPostModule } from './components/all-post/all-post.module';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UsersComponent } from './components/users/users.component';
import { DisplayImagesComponent } from './components/forlandingphotos/display-images/display-images.component';
import { ImagesHistoryComponent } from './components/forlandingphotos/images-history/images-history.component';
import { LoadingComponent } from './components/loading/loading.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PendingsComponent,
    AllPostComponent,
    AnnouncementComponent,
    ReportsComponent,
    UsersComponent,
    DisplayImagesComponent,
    ImagesHistoryComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    PendingsModule,
    AllPostModule
  ]
})
export class AdminModule { }
