import { Routes } from '@angular/router';
import { AuthGuard as authGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  }
];
