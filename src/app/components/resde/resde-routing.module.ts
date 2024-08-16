import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResdeComponent } from './resde.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'resde-app', pathMatch: 'full' },
  { path: 'resde-app', component: LandingPageComponent },
  { path: 'login-to-resde', component: LoginComponent },
  { path: 'signup-to-resde', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResdeRoutingModule { }
