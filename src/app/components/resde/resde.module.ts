import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResdeRoutingModule } from './resde-routing.module';
import { ResdeComponent } from './resde.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [
    // ResdeComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    ResdeRoutingModule,
    MaterialModule
  ]
})
export class ResdeModule { }
