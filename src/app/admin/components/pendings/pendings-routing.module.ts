import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingsRoutingModule { }
