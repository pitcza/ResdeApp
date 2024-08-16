import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MainModule } from './main/main.module';
import { LogoutComponent } from './components/logout/logout.component';
import { ResdeComponent } from './components/resde/resde.component';
import { ResdeModule } from './components/resde/resde.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LogoutComponent,
    ResdeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    ResdeModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
