import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgriExpertRoutingModule } from './agri-expert-routing.module';
import { AgriExpertComponent } from './agri-expert.component';
import { MaterialModule } from '../modules/material.module';
import { PendingPostsModule } from './components/pending-posts/pending-posts.module';
import { AllPostsModule } from './components/all-posts/all-posts.module';
import { PendingPostsComponent } from './components/pending-posts/pending-posts.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TriviaComponent } from './components/trivia/trivia.component';
import { TriviaScoresComponent } from './components/trivia-scores/trivia-scores.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    PendingPostsComponent,
    AllPostsComponent,
    TriviaComponent,
    TriviaScoresComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AgriExpertRoutingModule,
    MaterialModule,
    PendingPostsModule,
    AllPostsModule
  ]
})
export class AgriExpertModule { }
