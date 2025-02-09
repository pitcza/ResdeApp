import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessages: string[] = [];
  isLoading = false;
  passwordVisible = false;

  // method to toggle the password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private as: AuthserviceService
  ) {}

  ngOnInit() {  
    // Retrieve email and password from query parameters if available
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginData.email = params['email'];
      }
      if (params['password']) {
        this.loginData.password = params['password'];

        const swalLoading = Swal.fire({
          title: 'Password Reset Successful!',
          text: 'Logging in with your new password...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        // Wait for delay before calling onLogin
        setTimeout(() => {
          Swal.close();  // Close loading after delay
          this.onLogin();  // Call onLogin after the delay
        }, 1500);
      }
    });
  }
  

  onLogin() {
    this.isLoading = true;

    // Check if email or password is blank
    if (!this.loginData.email || !this.loginData.password) {
      this.isLoading = false;
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Enter your email and password!',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
      });
      return; // Exit the function
    }

    const formData = new FormData();
    formData.append('email', this.loginData.email);
    formData.append('password', this.loginData.password);

    this.as.login(formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        localStorage.setItem('authToken', response.token);

        switch (response.role) {
          case 'admin':
            console.log('Navigating to /admin');
            this.router.navigate(['/admin']).then(() => {
              this.showSuccessAlert();
            });
            break;
          case 'agri':
            console.log('Navigating to /agri-admin');
            this.router.navigate(['/agri-admin']).then(() => {
              this.showSuccessAlert();
            });
            break;
          default:
            console.log('Navigating to /main');
            this.router.navigate(['/main']).then(() => {
              this.showSuccessAlert();
            });
            break;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);

        let title = 'Login Failed';
        let icon = 'error';

        if (error.status === 401) {
          title = 'Invalid Credentials';
          icon = 'warning';
        } else {
          title = 'An Error Occurred';
        }

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          iconColor: '#FF6B6B',
          title: title,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    );
  }

  showSuccessAlert() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      iconColor: '#689f7a',
      title: 'Login Successfully',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
  }
}
