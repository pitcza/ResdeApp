import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResdeRoutingModule } from './resde-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../../modules/material.module';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { ClickableRsComponent } from './landing-page/clickable-rs/clickable-rs.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    PrivacypolicyComponent,
    TermsConditionsComponent,
    ForgotPasswordComponent,
    ClickableRsComponent,
  ],
  imports: [
    CommonModule,
    ResdeRoutingModule,
    MaterialModule,
    FormsModule,
    MatDialogModule,
  ]
})
export class ResdeModule { }
