import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// client user
import { ResdeComponent } from './components/resde/resde.component';
import { MainComponent } from './main/main.component';

// admin panel
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'resde', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'main', component: MainComponent, children: [{ path: '', loadChildren: ()=>import('./main/main.module').then((m)=>m.MainModule) }] },
  { path: 'resde', component: ResdeComponent, children: [{ path: '', loadChildren: ()=>import('./components/resde/resde.module').then((m)=>m.ResdeModule) }] },
  { path: 'admin', component: AdminComponent, children: [{ path: '', loadChildren: ()=>import('./admin/admin.module').then((m)=>m.AdminModule) }] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
