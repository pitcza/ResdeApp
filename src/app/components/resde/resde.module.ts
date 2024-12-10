import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResdeRoutingModule } from './resde-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../../modules/material.module';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    PrivacypolicyComponent,
    TermsConditionsComponent,
  ],
  imports: [
    CommonModule,
    ResdeRoutingModule,
    MaterialModule
  ]
})
export class ResdeModule { }
