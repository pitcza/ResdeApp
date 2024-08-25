import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { ViewPendingComponent } from './view-pending/view-pending.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-of-posts', pathMatch: 'full' },
  { path: 'list-of-posts', component: ListComponent },
  { path: 'view', component: ViewPendingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingsRoutingModule { }
