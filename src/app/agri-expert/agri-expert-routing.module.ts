import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgriExpertComponent } from './agri-expert.component';
import { TriviaComponent } from './components/trivia/trivia.component';
import { TriviaScoresComponent } from './components/trivia-scores/trivia-scores.component';
import { MyPostsComponent } from './components/my-posts/my-posts.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ReportedPostsComponent } from './components/reported-posts/reported-posts.component';

const routes: Routes = [
  { path: '', redirectTo: 'allposts', pathMatch: 'full' },
  { path: 'allposts', component: AllPostsComponent },
  { path: 'my-posts', component: MyPostsComponent },
  { path: 'reportedposts', component: ReportedPostsComponent },
  { path: 'trivia', component: TriviaComponent },
  { path: 'trivia-scores', component: TriviaScoresComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgriExpertRoutingModule { }
