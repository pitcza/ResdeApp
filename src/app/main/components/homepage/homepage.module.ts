import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { UserpostComponent } from './userpost/userpost.component';

import { MaterialModule } from '../../../modules/material.module';
import { ViewAnnouncemComponent } from './view-announcem/view-announcem.component';


@NgModule({
  declarations: [
    UserpostComponent,
    ViewAnnouncemComponent,
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    MaterialModule,
  ]
})
export class HomepageModule { }
