import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core'; // Added importProvidersFrom here for tidiness
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModule
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Home, Settings, DollarSign, LogIn, LogOut } from 'lucide-angular';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, NgbModule), // Add NgbModule here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    LucideAngularModule.pick({ Home, Settings, DollarSign, LogIn, LogOut })
  ]
};
