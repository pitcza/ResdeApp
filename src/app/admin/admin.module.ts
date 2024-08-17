import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../modules/material.module';
import { PendingsComponent } from './components/pendings/pendings.component';
import { PendingsModule } from './components/pendings/pendings.module';


@NgModule({
  declarations: [
    DashboardComponent,
    PendingsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    PendingsModule
  ]
})
export class AdminModule { }
