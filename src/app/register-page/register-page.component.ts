import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  gender = '';

  errorMessages: string[] = [];
  successMessage = '';
  loading = false;

  constructor(private auth: AuthService) {}

  register() {
    this.errorMessages = [];
    this.successMessage = '';
    this.loading = true;

    this.auth
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        gender: this.gender,
      })
      .subscribe({
        next: () => {
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
          this.gender = '';

          this.successMessage = 'You have successfully registered!';
          this.loading = false;
        },
        error: (err) => {
          if (err.error?.errors) {
            this.errorMessages = err.error.errors;
          } else if (err.error?.message) {
            this.errorMessages = [err.error.message];
          } else {
            this.errorMessages = ['Something went wrong'];
          }
          this.loading = false;
        },
      });
  }
}
