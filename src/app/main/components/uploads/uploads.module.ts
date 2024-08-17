import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadsRoutingModule } from './uploads-routing.module';
import { UploadsComponent } from './uploads.component';
import { PostslistComponent } from './postslist/postslist.component';
import { MaterialModule } from '../../../modules/material.module';
import { UploadformComponent } from './uploadform/uploadform.component';


@NgModule({
  declarations: [
    UploadsComponent,
    PostslistComponent,
    UploadformComponent
  ],
  imports: [
    CommonModule,
    UploadsRoutingModule,
    MaterialModule
  ]
})
export class UploadsModule { }
