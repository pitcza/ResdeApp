import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private as: AuthserviceService
  ) {}

  // onLogin() {
  //   this.isLoading = true;
  //   const formData = new FormData();
  //   formData.append('email', this.loginData.email);
  //   formData.append('password', this.loginData.password);

  //   this.as.login(formData).subscribe(
  //     (response: any) => {
  //       this.isLoading = false;
        
  //       console.log('Login successful:', response);
        
  //       this.router.navigate(['/main']);

  //       Swal.fire({
  //         toast: true,
  //         position: 'top-end',
  //         icon: 'success',
  //         iconColor: '#9EB3AA',
  //         title: 'Login Successfully',
  //         customClass: { popup: 'swal-font' },
  //         showConfirmButton: false,
  //         timer: 5000,
  //         timerProgressBar: true,
  //       });

  //     },
  //     (error: any) => {
  //       if (error.errors) {
  //         this.errorMessages = error.errors;
  //       } else {
  //         console.error('Login failed:', error);
  //       }
  //     }
  //   );
  // }

  onLogin() {
    this.isLoading = true;
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
            this.router.navigate(['/admin']);
            break;
          case 'agri':
            console.log('Navigating to /agri-admin');
            this.router.navigate(['/agri-admin']);
            break;
          default:
            console.log('Navigating to /main');
            this.router.navigate(['/main']);
            break;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
      }
    );
}
  
  landingPage() {
    this.router.navigate(['app/resde/resde-app']);
  }
}
