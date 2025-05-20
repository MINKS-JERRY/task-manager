import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app-routing.module';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { environment } from '../environments/environment';
import { environment as prodEnvironment } from '../environments/environment.prod';

const ENV = isDevMode() ? environment : prodEnvironment;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    { provide: 'environment', useValue: ENV }
  ]
};
