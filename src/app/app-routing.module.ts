import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ResdeComponent } from './components/resde/resde.component';
import { LoginComponent } from './components/resde/login/login.component';
import { LandingPageComponent } from './components/resde/landing-page/landing-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'resde', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  { path: 'main', 
    component: MainComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./main/main.module').then((m)=>m.MainModule)
    }]
  },
  { path: 'resde', 
    component: ResdeComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/resde/resde.module').then((m)=>m.ResdeModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
