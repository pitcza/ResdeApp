import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ApprovedListComponent } from './approved-list/approved-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-of-posts', pathMatch: 'full' },
  { path: 'list-of-posts', component: ListComponent },
  { path: 'view-post', component: ViewComponent },
  { path: 'approved-posts', component: ApprovedListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingsRoutingModule { }
