import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingsRoutingModule } from './pendings-routing.module';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MaterialModule } from '../../../modules/material.module';
import { ApprovedListComponent } from './approved-list/approved-list.component';
import { ViewPendingComponent } from './view-pending/view-pending.component';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent,
    ApprovedListComponent,
    ViewPendingComponent
  ],
  imports: [
    CommonModule,
    PendingsRoutingModule,
    MaterialModule
  ]
})
export class PendingsModule { }
