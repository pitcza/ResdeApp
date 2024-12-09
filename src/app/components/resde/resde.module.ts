import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResdeRoutingModule } from './resde-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../../modules/material.module';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    PrivacypolicyComponent,
  ],
  imports: [
    CommonModule,
    ResdeRoutingModule,
    MaterialModule
  ]
})
export class ResdeModule { }
