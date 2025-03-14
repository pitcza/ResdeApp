import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgriExpertRoutingModule } from './agri-expert-routing.module';
import { AgriExpertComponent } from './agri-expert.component';
import { MaterialModule } from '../modules/material.module';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TriviaComponent } from './components/trivia/trivia.component';
import { TriviaScoresComponent } from './components/trivia-scores/trivia-scores.component';
import { ViewComponent } from './components/view/view.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import { UploadComponent } from './components/my-posts/upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreatetriviaComponent } from './components/trivia/createtrivia/createtrivia.component';
import { EditTriviaComponent } from './components/trivia/edit-trivia/edit-trivia.component';
import { ViewTriviaComponent } from './components/trivia/view-trivia/view-trivia.component';
import { ReportedPostsComponent } from './components/reported-posts/reported-posts.component';


@NgModule({
  declarations: [
    AllPostsComponent,
    TriviaComponent,
    TriviaScoresComponent,
    ViewComponent,
    CreatetriviaComponent,
    EditTriviaComponent,
    ViewTriviaComponent,
    MyPostsComponent,
    UploadComponent,
    ReportedPostsComponent
  ],
  imports: [
    CommonModule,
    AgriExpertRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AgriExpertModule { }
