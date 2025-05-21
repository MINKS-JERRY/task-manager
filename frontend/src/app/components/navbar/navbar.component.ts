import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-md fixed w-full top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Task Manager
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button 
              (click)="isMenuOpen = !isMenuOpen" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg 
                [class.hidden]="isMenuOpen" 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                [class.hidden]="!isMenuOpen" 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Desktop menu -->
          <div class="hidden sm:flex sm:items-center sm:space-x-4">
            <ng-container *ngIf="!authService.isLoggedIn(); else loggedIn">
              <a routerLink="/login" routerLinkActive="text-blue-600" class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Login
              </a>
              <a routerLink="/register" routerLinkActive="text-blue-600" class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Register
              </a>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div [class.hidden]="!isMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1 bg-white border-t">
          <ng-container *ngIf="!authService.isLoggedIn(); else mobileLoggedIn">
            <a 
              routerLink="/login" 
              routerLinkActive="text-blue-600 bg-blue-50" 
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              (click)="isMenuOpen = false"
            >
              Login
            </a>
            <a 
              routerLink="/register" 
              routerLinkActive="text-blue-600 bg-blue-50" 
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              (click)="isMenuOpen = false"
            >
              Register
            </a>
          </ng-container>
        </div>
      </div>
    </nav>

    <!-- Templates for logged-in state -->
    <ng-template #loggedIn>
      <a routerLink="/tasks" routerLinkActive="text-blue-600" class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
        Tasks
      </a>
      <button 
        (click)="logout()" 
        class="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
      >
        Logout
      </button>
    </ng-template>

    <ng-template #mobileLoggedIn>
      <a 
        routerLink="/tasks" 
        routerLinkActive="text-blue-600 bg-blue-50" 
        class="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
        (click)="isMenuOpen = false"
      >
        Tasks
      </a>
      <button 
        (click)="logout(); isMenuOpen = false" 
        class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
      >
        Logout
      </button>
    </ng-template>
  `
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
