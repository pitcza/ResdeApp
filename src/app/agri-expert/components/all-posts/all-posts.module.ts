import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostsRoutingModule } from './all-posts-routing.module';
import { AllPostsComponent } from './all-posts.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from '../../../modules/material.module';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { UploadComponent } from './upload/upload.component';
import { AgrieditComponent } from './agriedit/agriedit.component';


@NgModule({
  declarations: [
    ListComponent,
    MyPostsComponent,
    UploadComponent,
    AgrieditComponent
  ],
  imports: [
    CommonModule,
    AllPostsRoutingModule,
    MaterialModule
  ]
})
export class AllPostsModule { }
