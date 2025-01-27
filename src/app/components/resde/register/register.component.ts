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
  age: string;
  street: string;
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
    age: '',
    street: '',
    barangay: 'Gordon Heights',
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
  ages: number[] = Array.from({ length: 100 }, (_, i) => i + 1);

  streets: string[] = [
    'Acacia St.',
    'Mercurio St.',
    'Coral St.',
    'Simpson St.',
    'Neptune St.',
    'Cleopatra St.',
    'Keith St.',
    'Dayanan St.',
    'Ruano St.',
    'Woodhouse St.',
    'Arriola St.',
    'Pacheco St.',
    'Ramirez St.',
    'Sander St.',
    'Kaufman St.',
    'Ramirez St.',
    'Cava St.',
    'Blk #1 Fedrico St. (Long Rd, Upper)',
    'Blk #1 Fedrico St. (Waterdam Rd, Lower)',
    'Blk #2 Gomez St. (Long Rd, Upper)',
    'Blk #2 Gomez St. (Waterdam Rd, Lower)',
    'Blk #3 Diwa St. (Long Rd, Upper)',
    'Blk #3 Diwa St. (Waterdam Rd, Lower)',
    'Blk #4 Adamos St. (Long Rd, Upper)',
    'Blk #4 Adamos St. (Waterdam Rd, Lower)',
    'Blk #5 Balete St. (Long Rd, Upper)',
    'Blk #5 Balete St. (Waterdam Rd, Lower)',
    'Blk #6 Casoy St. (Long Rd, Upper)',
    'Blk #6 Casoy St. (Waterdam Rd, Lower)',
    'Blk #7 Duhat St. (Long Rd, Upper)',
    'Blk #7 Duhat St. (Waterdam Rd, Lower)',
    'Blk #8 Eucalyptus St. (Long Rd, Upper)',
    'Blk #8 Eucalyptus St. (Waterdam Rd, Lower)',
    'Blk #9 Fire Tree St. (Long Rd, Upper)',
    'Blk #9 Fire Tree St. (Waterdam Rd, Lower)',
    'Blk #10 Guava St. (Long Rd, Upper)',
    'Blk #10 Guava St. (Waterdam Rd, Lower)',
    'Blk #11 Herbabuena St. (Long Rd, Upper)',
    'Blk #11 Herbabuena St. (Waterdam Rd, Lower)',
    'Blk #12 Ipil-Ipil St. (Long Rd, Upper)',
    'Blk #12 Ipil-Ipil St. (Waterdam Rd, Lower)',
    'Blk #13 Jacaranda St. (Long Rd, Upper)',
    'Blk #13 Jacaranda St. (Waterdam Rd, Lower)',
    'Blk #14 Kalatsuchi St. (Long Rd, Upper)',
    'Blk #14 Kalatsuchi St. (Waterdam Rd, Lower)',
    'Blk #15 Latiris St. (Long Rd, Upper)',
    'Blk #15 Latiris St. (Waterdam Rd, Lower)',
    'Blk #16 Mangga St. (Long Rd, Upper)',
    'Blk #16 Mangga St. (Waterdam Rd, Lower)',
    'Blk #17 Narra St. (Long Rd, Upper)',
    'Blk #17 Narra St. (Waterdam Rd, Lower)',
    'Blk #18 Oliva St. (Long Rd, Upper)',
    'Blk #18 Oliva St. (Waterdam Rd, Lower)',
    'Blk #19 Palo Santo St. (Long Rd, Upper)',
    'Blk #19 Palo Santo St. (Waterdam Rd, Lower)',
    'Blk #20 Rimas St. (Long Rd, Upper)',
    'Blk #20 Rimas St. (Waterdam Rd, Lower)',
    'Blk #21 Santol St. (Long Rd, Upper)',
    'Blk #21 Santol St. (Waterdam Rd, Lower)',
    'Blk #22 Talisay St. (Long Rd, Upper)',
    'Blk #22 Talisay St. (Waterdam Rd, Lower)',
    'Blk #23 Ubas St. (Long Rd, Upper)',
    'Blk #23 Ubas St. (Waterdam Rd, Lower)',
    'Blk #24 Verbena St. (Long Rd, Upper)',
    'Blk #24 Verbena St. (Waterdam Rd, Lower)',
    'Blk #25 Waling Waling St. (Long Rd, Upper)',
    'Blk #25 Waling Waling St. (Waterdam Rd, Lower)',
    'Blk #26 / Long Rd (Taas/Upper)',
    'Blk #26 / Waterdam Rd (Baba/Lower)',
    'Blk #27 / Long Rd (Taas/Upper)',
    'Blk #27 / Waterdam Rd(Baba/Lower)',
    'Blk #28 / Long Rd (Taas/Upper)',
    'Blk #28 / Waterdam Rd (Baba/Lower)',
    'Blk #29 / Waterdam Rd (Baba/Lower)',
    'Blk #30 / Waterdam Rd (Baba/Lower)',
    'Blk #31 / Waterdam Rd (Baba/Lower)'
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private as: AuthserviceService
  ) {}

  passwordVisible = false;
  confirmPasswordVisible = false;

  // method to toggle the password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // phone number validations
  phoneNumberInvalid: boolean = false;

  onPhoneNumberInput(event: any): void {
    const allowedKeys = ['+', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
  
    if (!allowedKeys.includes(event.data)) {
      event.preventDefault();
    }
  
    if (!currentValue.startsWith('+63 ')) {
      input.value = `+63 ${currentValue.replace(/^(\+63|0)?/, '')}`;
    }
  
    const rawNumber = currentValue.slice(3).replace(/\D/g, ''); // Exclude '+63'
  
    // Format the number as XXX-XXX-XXXX
    let formattedNumber = '';
    if (rawNumber.length > 0) formattedNumber += rawNumber.slice(0, 3);
    if (rawNumber.length > 3) formattedNumber += '-' + rawNumber.slice(3, 6);
    if (rawNumber.length > 6) formattedNumber += '-' + rawNumber.slice(6, 10);
  
    input.value = `+63 ${formattedNumber}`;
  
    this.phoneNumberInvalid = input.value.length !== 16;
  }
  
  // password validations
  passwordErrors = {
    required: false,
    length: false,
    capital: false,
    lowercase: false,
    number: false,
    special: false,
  };
  
  validatePassword(): void {
    const password = this.registerData.password;
  
    // error flags
    this.passwordErrors.required = !password;
    this.passwordErrors.length = password.length > 0 && password.length < 8; // for at least 8 characters
    this.passwordErrors.capital = !/[A-Z]/.test(password); // for capital letter
    this.passwordErrors.lowercase = !/[a-z]/.test(password); // for small letter
    this.passwordErrors.number = !/\d/.test(password); // for number
    this.passwordErrors.special = !/[!@#$%^&*(),.?":{}|<>]/.test(password); // for special character
  }

  onRegister() {
    // Check if all required fields are filled
    if (!this.registerData.fname || !this.registerData.lname || !this.registerData.email ||
        !this.registerData.phone_number || !this.registerData.barangay || 
        !this.registerData.street || !this.registerData.age ||
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

    // Check if the phone number is valid
    if (this.registerData.phone_number.length !== 16) {
      Swal.fire({
        title: "Error",
        text: "Phone number is not valid. Please enter a valid phone number (e.g., +63 912-345-6789).",
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
      return; // Stop form submission if the phone number is invalid
    }

    // Validate password requirements
    this.validatePassword();
    if (
      this.passwordErrors.required ||
      this.passwordErrors.length ||
      this.passwordErrors.capital ||
      this.passwordErrors.lowercase ||
      this.passwordErrors.number ||
      this.passwordErrors.special
    ) {
      let errorMessage = "Password must meet the following requirements:\n";
      if (this.passwordErrors.length) errorMessage += "- At least 8 characters long.\n";
      if (this.passwordErrors.capital) errorMessage += "- Include at least one capital letter (A-Z).\n";
      if (this.passwordErrors.lowercase) errorMessage += "- Include at least one small letter (a-z).\n";
      if (this.passwordErrors.number) errorMessage += "- Include at least one number (0-9).\n";
      if (this.passwordErrors.special) errorMessage += "- Include at least one special character (!@#$%^&*).\n";

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: 'OK',
        confirmButtonColor: "#7f7f7f",
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      });
      return; // Stop if password doesn't meet requirements
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