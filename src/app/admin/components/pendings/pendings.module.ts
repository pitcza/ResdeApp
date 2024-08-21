import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingsRoutingModule } from './pendings-routing.module';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MaterialModule } from '../../../modules/material.module';
import { ApprovedListComponent } from './approved-list/approved-list.component';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent,
    ApprovedListComponent
  ],
  imports: [
    CommonModule,
    PendingsRoutingModule,
    MaterialModule
  ]
})
export class PendingsModule { }
