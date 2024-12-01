import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadsRoutingModule } from './uploads-routing.module';
import { UploadsComponent } from './uploads.component';
import { PostslistComponent } from './postslist/postslist.component';
import { MaterialModule } from '../../../modules/material.module';
import { UploadformComponent } from './uploadform/uploadform.component';
import { EditpostComponent } from './editpost/editpost.component';
import { ViewComponent } from './view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UploadsComponent,
    PostslistComponent,
    UploadformComponent,
    EditpostComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    UploadsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UploadsModule { }
