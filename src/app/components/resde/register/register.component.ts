import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';

import Swal from 'sweetalert2';

// Define an interface for the registration data
interface RegisterData {
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  barangay: string;
  city: string;
  password: string;
  password_confirmation: string;
  privacy: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerData: RegisterData = {
      fname: '',
      lname: '',
      email: '',
      phone_number: '',
      barangay: '',
      city: '',
      password: '',
      password_confirmation: '',
      privacy: false
    };
    errorMessages: string[] = [];
    barangays: string[] = [
      'Asinan', 'Banicain', 'Barreto', 'East Bajac-bajac', 'East Tapinac',
      'Gordon Heights', 'Kalaklan', 'New Kalalake', 'Mabayuhan', 'New Cabalan',
      'New Ilalim', 'New Kababae', 'Pag-asa', 'Santa Rita', 'West Tapinac',
      'Old Cabalan'
    ];

    constructor(
      private router: Router,
      private as: AuthserviceService
    ) {}

    onRegister() {
      const formData = new FormData();

      // Append all fields from registerData to formData
      Object.keys(this.registerData).forEach(key => {
        const value = this.registerData[key as keyof RegisterData];
        formData.append(key, value.toString());
      });

      this.as.register(formData).subscribe(
        (response: any) => {
          // Handle successful registration
          console.log('Registration successful:', response);
          this.router.navigate(['/login-to-resIt']); // Redirect after successful registration

          Swal.fire({
            title: "Registration Successful!",
            text: "You can now login your Re'sIt account.",
            customClass: { popup: 'swal-font' },
            icon: "success",
            iconColor: '#9EB3AA',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            timer: 5000,
            scrollbarPadding: false
          });
        },
        (error: any) => {
          // Handle error response
          if (error.errors) {
            this.errorMessages = error.errors;
          } else {
            console.error('Registration failed:', error);
          }
        }
      );
    }
}