import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    this.errorMessage = '';

    this.auth
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
        },
      });
  }
}
