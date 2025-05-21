import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  user: RegisterForm = {
    username: '',
    password: '',
    confirmPassword: ''
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.error = '';

    // Validate input fields
    if (!this.user.username || !this.user.password || !this.user.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.user.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    const { confirmPassword, ...registerData } = this.user;
    console.log('Attempting registration with:', { username: registerData.username });

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        if (err.status === 0) {
          this.error = 'Unable to connect to the server. Please try again later.';
        } else {
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
