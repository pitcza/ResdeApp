import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingsRoutingModule } from './pendings-routing.module';
import { PendingsComponent } from './pendings.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from '../../../modules/material.module';


@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    PendingsRoutingModule,
    MaterialModule
  ]
})
export class PendingsModule { }
