import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserpostComponent } from './userpost/userpost.component';

const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'viewpost', component: UserpostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
