import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingPostsRoutingModule } from './pending-posts-routing.module';
import { PendingPostsComponent } from './pending-posts.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MaterialModule } from '../../../modules/material.module';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    PendingPostsRoutingModule,
    MaterialModule
  ]
})
export class PendingPostsModule { }
