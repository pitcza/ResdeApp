import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPostsComponent } from './all-posts.component';

import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'view', component: ViewComponent },
  { path: 'my-posts', component: MyPostsComponent },
  { path: 'upload-form', component: UploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPostsRoutingModule { }
