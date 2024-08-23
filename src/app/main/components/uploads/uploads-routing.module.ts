import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadsComponent } from './uploads.component';
import { PostslistComponent } from './postslist/postslist.component';
import { UploadformComponent } from './uploadform/uploadform.component';
import { EditpostComponent } from './editpost/editpost.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PostslistComponent },
  { path: 'upload-post', component: UploadformComponent },
  { path: 'edit-post', component: EditpostComponent },
  { path: 'view-post', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadsRoutingModule { }
