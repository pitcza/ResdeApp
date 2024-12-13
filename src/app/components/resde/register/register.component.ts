import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';

import Swal from 'sweetalert2';
import { PrivacypolicyComponent } from '../privacypolicy/privacypolicy.component';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';

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
      city: 'Olongapo City',
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
      private dialog: MatDialog,
      private router: Router,
      private as: AuthserviceService
    ) {}

  onRegister() {
    // Check if all required fields are filled
    if (!this.registerData.fname || !this.registerData.lname || !this.registerData.email ||
        !this.registerData.phone_number || !this.registerData.barangay || 
        !this.registerData.password || !this.registerData.password_confirmation) {
      
      Swal.fire({
        title: "Error",
        text: "Please fill in all the required fields.",
        icon: "error",
        confirmButtonText: 'OK',
        confirmButtonColor: "#7f7f7f",
        timer: 5000,
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      });
      return; // Stop form submission if any field is empty
    }
  
    // Check if the privacy policy checkbox is checked
    if (!this.registerData.privacy) {
      Swal.fire({
        title: "Action Required",
        text: "You must agree to the Terms and Conditions and Privacy Policy to proceed.",
        icon: "error",
        confirmButtonText: 'Close',
        confirmButtonColor: "#7f7f7f",
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      });
      return; // Stop form submission if privacy is not checked
    }

    // Check if the password is at least 8 characters
    if (this.registerData.password.length < 8) {
      Swal.fire({
        title: "Error",
        text: "Password must be at least 8 characters long.",
        icon: "error",
        confirmButtonText: 'OK',
        confirmButtonColor: "#7f7f7f",
        timer: 5000,
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      });
      return; // Stop form submission if password length is less than 8
    }
  
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
        this.router.navigate(['/resIt/login-to-resIt']); // Redirect after successful registration
    
        Swal.fire({
          title: "Registration Successful!",
          text: "You can now login to your Re'sIt account.",
          icon: "success",
          iconColor: '#689f7a',
          confirmButtonText: 'Close',
          confirmButtonColor: "#7f7f7f",
          timer: 5000,
          scrollbarPadding: false,
          willOpen: () => {
            document.body.style.overflowY = 'scroll';
          },
          willClose: () => {
            document.body.style.overflowY = 'scroll';
          }
        });
      },
      (error: any) => {
        // Handle validation errors
        if (error.error && error.error.email) {
          Swal.fire({
            title: "Email Error",
            text: error.error.email[0], // Display the specific error message
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000,
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            }
          });
        } else {
          Swal.fire({
            title: "Registration Failed",
            text: "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000,
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            }
          });
        }
        console.error('Registration failed:', error);
      }
    );
    
  }
  

  // VIEWING TERMS AND CONDITIONS
  viewTerms() {
    if (this.dialog) {
      this.dialog.open(TermsConditionsComponent)
    } else {
      console.error('Terms and conditions dialog not found');
    }
  }

  // VIEWING PRIVACY POLICY
  viewPolicy() {
    if (this.dialog) {
      this.dialog.open(PrivacypolicyComponent)
    } else {
      console.error('Privacy policy dialog not found');
    }
  }
}