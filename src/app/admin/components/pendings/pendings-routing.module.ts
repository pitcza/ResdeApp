import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { ViewPendingComponent } from './view-pending/view-pending.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'view/:id', component: ViewPendingComponent },
  { path: 'view', component: ViewPendingComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingsRoutingModule { }
