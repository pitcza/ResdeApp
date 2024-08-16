import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { AllpostsComponent } from './allposts/allposts.component';
import { UserpostComponent } from './userpost/userpost.component';


@NgModule({
  declarations: [
    AllpostsComponent,
    UserpostComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule
  ]
})
export class HomepageModule { }
