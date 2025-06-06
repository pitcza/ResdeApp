import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { HomepageComponent } from './components/homepage/homepage.component';
import { HomepageModule } from './components/homepage/homepage.module';

import { LikedpostsComponent } from './components/likedposts/likedposts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GreenmoduleComponent } from './components/greenmodule/greenmodule.component';
import { MaterialModule } from '../modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadPostComponent } from './components/upload-post/upload-post.component';
import { RouterModule } from '@angular/router';
import { ViewBrgypostComponent } from './components/greenmodule/view-brgypost/view-brgypost.component';

@NgModule({
  declarations: [
    HomepageComponent,
    LikedpostsComponent,
    ProfileComponent,
    GreenmoduleComponent,
    UploadPostComponent,
    ViewBrgypostComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MainRoutingModule,
    HomepageModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
