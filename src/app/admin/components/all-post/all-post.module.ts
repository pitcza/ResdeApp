import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostRoutingModule } from './all-post-routing.module';
import { AllPostComponent } from './all-post.component';
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
    AllPostRoutingModule,
    MaterialModule
  ]
})
export class AllPostModule { }
