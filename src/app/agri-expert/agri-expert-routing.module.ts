import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgriExpertComponent } from './agri-expert.component';
import { TriviaComponent } from './components/trivia/trivia.component';
import { TriviaScoresComponent } from './components/trivia-scores/trivia-scores.component';

const routes: Routes = [
  { path: '', redirectTo: 'pendingposts', pathMatch: 'full' },
  { path: 'allposts', loadChildren: () => import('./components/all-posts/all-posts.module').then(m => m.AllPostsModule) },
  { path: 'pendingposts', loadChildren: () => import('./components/pending-posts/pending-posts.module').then(m => m.PendingPostsModule) },
  { path: 'trivia', component: TriviaComponent },
  { path: 'trivia-scores', component: TriviaScoresComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgriExpertRoutingModule { }
