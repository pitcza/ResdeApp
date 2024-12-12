import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingPostsComponent } from './pending-posts.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPostsRoutingModule { }
