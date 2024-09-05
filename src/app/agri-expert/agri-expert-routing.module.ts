import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgriExpertComponent } from './agri-expert.component';

const routes: Routes = [{ path: '', component: AgriExpertComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgriExpertRoutingModule { }
