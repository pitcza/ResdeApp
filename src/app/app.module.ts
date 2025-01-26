import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MainModule } from './main/main.module';
import { LogoutComponent } from './components/logout/logout.component';
import { ResdeComponent } from './components/resde/resde.component';
import { ResdeModule } from './components/resde/resde.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './modules/material.module';
import { AdminModule } from './admin/admin.module';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AgriExpertComponent } from './agri-expert/agri-expert.component';
import { AgriExpertModule } from './agri-expert/agri-expert.module';
import { TriviaComponent } from './agri-expert/components/trivia/trivia.component';
// import { TriviaScore } from './agri-expert/components/trivia-score/trivia-score.component';
// import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LogoutComponent,
    ResdeComponent,
    AdminComponent,
    AgriExpertComponent,
    // TriviaComponent,
    // TriviaScore,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    ResdeModule,
    MaterialModule,
    AdminModule,
    AgriExpertModule,
    HttpClientModule,
  //   ServiceWorkerModule.register('ngsw-worker.js', {
  //     enabled: !isDevMode(),
  //     // Register the ServiceWorker as soon as the application is stable
  //     // or after 30 seconds (whichever comes first).
  //     registrationStrategy: 'registerWhenStable:30000'
  //   })
  // ],
  



  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
