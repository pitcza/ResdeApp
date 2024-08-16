import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { HomepageComponent } from './components/homepage/homepage.component';
import { HomepageModule } from './components/homepage/homepage.module';
import { LikedpostsComponent } from './components/likedposts/likedposts.component';


@NgModule({
  declarations: [
    HomepageComponent,
    LikedpostsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    HomepageModule
  ]
})
export class MainModule { }
