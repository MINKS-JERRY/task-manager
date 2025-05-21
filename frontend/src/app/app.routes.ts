import { Routes } from '@angular/router';
import { AuthGuard as authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },

  // Protected routes
  {
    path: 'tasks',
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },

  // Default route
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },

  // Catch-all route
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
