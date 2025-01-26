import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// client user
import { ResdeComponent } from './components/resde/resde.component';
import { MainComponent } from './main/main.component';

// admin panel
import { AdminComponent } from './admin/admin.component';
import { AgriExpertComponent } from './agri-expert/agri-expert.component';

const routes: Routes = [
  { path: '', redirectTo: 'resIt', pathMatch: 'full' },
  { path: 'main', component: MainComponent, children: [{ path: '', loadChildren: ()=>import('./main/main.module').then((m)=>m.MainModule) }] },
  { path: 'resIt', component: ResdeComponent, children: [{ path: '', loadChildren: ()=>import('./components/resde/resde.module').then((m)=>m.ResdeModule) }] },
  { path: 'admin', component: AdminComponent, children: [{ path: '', loadChildren: ()=>import('./admin/admin.module').then((m)=>m.AdminModule) }] },
  { path: 'agri-admin', component: AgriExpertComponent, children: [{ path: '', loadChildren: ()=>import('./agri-expert/agri-expert.module').then((m)=>m.AgriExpertModule) }] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
