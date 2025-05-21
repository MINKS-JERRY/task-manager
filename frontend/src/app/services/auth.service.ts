import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  isNewUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private authState = new BehaviorSubject<AuthState>({
    token: this.getStoredToken(),
    isAuthenticated: false,
    username: localStorage.getItem('username'),
    isNewUser: false
  });
  public authState$ = this.authState.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('environment') private env: { apiUrl: string }
  ) {
    this.apiUrl = `${this.env.apiUrl}/auth`;
    // Initialize auth state
    const token = this.getStoredToken();
    if (token) {
      this.validateAndSetToken(token);
    }
  }



  register(user: { username: string; password: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        // Store username and set as new user
        localStorage.setItem('username', user.username);
        this.authState.next({
          ...this.authState.value,
          username: user.username,
          isNewUser: true
        });
        // After successful registration, we'll navigate to login
        this.router.navigate(['/login']);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => error);
        }
        return this.handleError(error);
      })
    );
  }

  login(user: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('username', user.username);
          this.setAuthState(response.token, user.username);
          this.router.navigate(['/tasks']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
        }
        return this.handleError(error);
      })
    );
  }

  logout(): void {
    this.clearAuth();
    // Navigate to login without reloading
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private validateAndSetToken(token: string): void {
    try {
      // Basic validation - check if token is a valid JWT
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');
      
      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        this.clearAuth();
      } else {
        const username = localStorage.getItem('username') || '';
        this.setAuthState(token, username);
      }
    } catch (e) {
      this.clearAuth();
    }
  }

  private setAuthState(token: string, username: string): void {
    localStorage.setItem('token', token);
    this.authState.next({
      token,
      isAuthenticated: true,
      username,
      isNewUser: false
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authState.next({
      token: null,
      isAuthenticated: false,
      username: null,
      isNewUser: false
    });
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}
