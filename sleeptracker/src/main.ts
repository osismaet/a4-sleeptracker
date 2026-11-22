import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core';  // NEW
import { IonicStorageModule } from '@ionic/storage-angular';  

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { SleepService } from './app/services/sleep.service';  

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'ios' }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot()),                               
    provideAppInitializer(() => inject(SleepService).init()), 
  ],
});
