import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { AllpostsComponent } from './allposts/allposts.component';
import { UserpostComponent } from './userpost/userpost.component';
import { MaterialModule } from '../../../modules/material.module';


@NgModule({
  declarations: [
    AllpostsComponent,
    UserpostComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    MaterialModule,
  ]
})
export class HomepageModule { }
