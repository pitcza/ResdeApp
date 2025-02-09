import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'resIt-app', pathMatch: 'full' },
  { path: 'resIt-app', component: LandingPageComponent },
  { path: 'login-to-resIt', component: LoginComponent },
  { path: 'signup-to-resIt', component: RegisterComponent },
  { path: 'forgot-pass', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResdeRoutingModule { }
