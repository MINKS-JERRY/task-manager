import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

function authInterceptor(req: any, next: any) {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: 'environment', useValue: environment },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
