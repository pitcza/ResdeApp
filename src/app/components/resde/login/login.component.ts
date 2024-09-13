import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessages: string[] = [];

  constructor(
    private router: Router,
    private as: AuthserviceService
  ) {}

  onLogin() {
    const formData = new FormData();
    formData.append('email', this.loginData.email);
    formData.append('password', this.loginData.password);

    this.as.login(formData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        const userName = response.userName; // or any other identifier from the response

      // Store user information in sessionStorage
        sessionStorage.setItem('name', userName);
        
        this.router.navigate(['/main']);
      },
      (error: any) => {
        if (error.errors) {
          this.errorMessages = error.errors;
        } else {
          console.error('Login failed:', error);
        }
      }
    );
  }

  landingPage() {
    this.router.navigate(['app/resde/resde-app']);
  }
}
