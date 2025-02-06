import { Component, HostListener } from '@angular/core';
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
  agreedToTerms = false;
  agreedToPrivacy = false;
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

  ngOnInit() {
    if (localStorage.getItem('registrationCanceled') === 'true') {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Your registration was not saved.',
        showConfirmButton: false,
        timer: 3000
      });
  
      // Remove the flag so it doesn’t show on every reload
      localStorage.removeItem('registrationCanceled');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleRefresh(event: Event) {
    if (this.isPopupVisible) {
      event.preventDefault();
      event.returnValue = true;

      // ganito for dev?? sana gumana sa site, mawawala data sa database if nirefresh or leave page nang ndi ineenter code hehe
      // fetch('https://api.resit.site/api/cancel-due-refresh',
      fetch('http://127.0.0.1:8000/api/cancel-due-refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.registerData.email }),
        keepalive: true // Ensures request completes before page unloads
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        localStorage.setItem('registrationCanceled', 'true'); // Set flag before refresh
      })
      .catch(error => console.error('Error deleting user:', error));
    }
  }

  errorMessages: string[] = [];

  // age validation
  ages: number[] = Array.from({ length: 89 }, (_, i) => i + 12);
  isAgeValid(): boolean {
    const ageNumber = Number(this.registerData.age);
    return ageNumber >= 12 && ageNumber <= 100;
  }

  validateAgeInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
  
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

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

  verificationCode: string = '';
  passwordVisible = false;
  confirmPasswordVisible = false;
  isPopupVisible = false;

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
    let currentValue = input.value;

    // Prevent input if it's not an allowed key
    if (!allowedKeys.includes(event.data)) {
        event.preventDefault();
        return;
    }

    // Ensure the input starts with '+63 '
    if (!currentValue.startsWith('+63 ')) {
        currentValue = `+63 ${currentValue.replace(/^(\+63|0)?/, '')}`;
    }

    let rawNumber = currentValue.slice(4).replace(/\D/g, ''); // Exclude '+63 '

    // Ensure the first digit after +63 is always '9'
    if (rawNumber.length > 0 && rawNumber[0] !== '9') {
        rawNumber = '9' + rawNumber.substring(1);
    }

    // Format the number as 9XX-XXX-XXXX
    let formattedNumber = '';
    if (rawNumber.length > 0) formattedNumber += rawNumber.slice(0, 3);
    if (rawNumber.length > 3) formattedNumber += '-' + rawNumber.slice(3, 6);
    if (rawNumber.length > 6) formattedNumber += '-' + rawNumber.slice(6, 10);

    input.value = `+63 ${formattedNumber}`;
    this.registerData.phone_number = input.value;

    // Ensure the total length is 16 (including '+63 ')
    this.phoneNumberInvalid = this.registerData.phone_number.length !== 16;
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
    // Define field labels
    const fieldLabels: { [key: string]: string } = {
      fname: "First Name",
      lname: "Last Name",
      email: "Email",
      phone_number: "Phone Number",
      age: "Age",
      street: "Street",
      barangay: "Barangay",
      city: "City",
      password: "Password",
      password_confirmation: "Confirm Password"
    };

    // Identify missing fields (excluding privacy policy)
    const emptyFields = Object.keys(this.registerData)
      .filter(key => key !== 'privacy' && !this.registerData[key as keyof RegisterData])
      .map(key => fieldLabels[key]);

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Missing Required Fields",
        html: `Please fill in the following fields:<br><strong>${emptyFields.join(", ")}</strong>`,
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
      return; // Stop form submission
    }

    // Validate age
    if (!this.isAgeValid()) {
      Swal.fire({
        title: "Invalid Age",
        text: "You must be at least 12 years old to register.",
        icon: "error",
        confirmButtonText: 'OK',
        confirmButtonColor: "#7f7f7f",
        timer: 5000
      });
      return;
    }

    // Check if the phone number is valid
    if (this.registerData.phone_number.length !== 16) {
      Swal.fire({
        title: "Invalid Phone Number",
        text: "Phone number must be in the format: +63 XXX-XXX-XXXX.",
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
      let errorMessage = "Password must meet the following requirements: <br>";
      if (this.passwordErrors.length) errorMessage += "- At least 8 characters long. <br>";
      if (this.passwordErrors.capital) errorMessage += "- Include at least one capital letter (A-Z). <br>";
      if (this.passwordErrors.lowercase) errorMessage += "- Include at least one small letter (a-z). <br>";
      if (this.passwordErrors.number) errorMessage += "- Include at least one number (0-9). <br>";
      if (this.passwordErrors.special) errorMessage += "- Include at least one special character (!@#$%^&*). <br>";

      Swal.fire({
        title: "Password Requirements Not Met",
        html: errorMessage,
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

    Swal.fire({
      title: 'Registering...',
      text: 'Please wait while we process your registration.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const formData = new FormData();
  
    // Append all fields from registerData to formData
    Object.keys(this.registerData).forEach(key => {
      const value = this.registerData[key as keyof RegisterData];
      formData.append(key, value.toString());
    });
  
    this.as.register(formData).subscribe(
      (response: any) => {
        Swal.close();
        // Show the email verification popup when successfully registered
        this.isPopupVisible = true;
      },
      (error: any) => {
        Swal.close();
        if (error.status === 0) {
          Swal.fire({
            title: "No Internet Connection",
            text: "Please check your internet connection and try again.",
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000
          });
        } else if (error.error && error.error.email) {
          Swal.fire({
            title: "Email Error",
            text: error.error.email[0],
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000
          });
        } else {
          Swal.fire({
            title: "Registration Failed",
            text: "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000
          });
        }
      }
    );
    
  }

  // Method to handle email verification
  verifyEmail(code: string) {
    Swal.fire({
      title: 'Verifying Email...',
      text: 'Please wait while we verify your email.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.as.verifyEmailWithCode(this.registerData.email, code).subscribe(
      (response: any) => {
        Swal.close();
        Swal.fire({
          title: "Email Verified!",
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
        this.router.navigate(['/resIt/login-to-resIt']); // Redirect after successful verification
      },
      (error: any) => {
        Swal.close();

        // Check if the error message indicates an invalid code
        if (error.status === 400 && error.error?.error === "Invalid verification code.") {
          Swal.fire({
            title: "Invalid Code!",
            text: "Check your email again or request a new code.",
            icon: "warning",
            confirmButtonText: 'OK',
            confirmButtonColor: "#ff7043",
            timer: 5000
          });
        } else {
          Swal.fire({
            title: "Verification Failed",
            text: "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: 'OK',
            confirmButtonColor: "#7f7f7f",
            timer: 5000
          });
        }
      }
    );
  }


  // Function to resend the verification email
  resendVerificationEmail() {
    Swal.fire({
      title: 'Sending Another Code...',
      text: 'Please wait while we send your new verification code.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.as.resendVerificationEmail(this.registerData.email).subscribe(
      (response: any) => {
        Swal.close();
        Swal.fire({
          title: "Code Sent!",
          text: "A new verification code has been sent to your email.",
          icon: "success",
          confirmButtonText: 'OK',
          confirmButtonColor: "#7f7f7f",
          timer: 5000
        });
      },
      (error: any) => {
        Swal.close();
        Swal.fire({
          title: "Error",
          text: error.error.message || "Failed to resend verification email. Please try again.",
          icon: "error",
          confirmButtonText: 'OK',
          confirmButtonColor: "#7f7f7f",
          timer: 5000
        });
      }
    );
  }


  getMailProviderUrl(email: string): string {
    const domain = email.split('@')[1];
    
    switch (domain) {
      case 'gmail.com':
        return 'https://mail.google.com';
      case 'yahoo.com':
        return 'https://mail.yahoo.com';
      case 'outlook.com':
        return 'https://outlook.live.com';
      default:
        return 'https://www.' + domain;
    }
  }
  
  // Email verification cancellation logic
  cancelEmailVerification() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will cancel your registration.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the AuthserviceService to delete the data
        this.as.cancelRegistration(this.registerData.email).subscribe(
          () => {
            Swal.fire({
              title: 'Verification Canceled!',
              text: 'Your registration information has been deleted.',
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f'
            });
            this.isPopupVisible = false;
          },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'There was a problem deleting your information. Please try again.',
              icon: 'error',
              showCancelButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#7f7f7f',
            });
          }
        );
      }
    });
  }

  // Open Terms and Conditions modal
  viewTerms() {
    const dialogRef = this.dialog.open(TermsConditionsComponent);
    dialogRef.componentInstance.agreed.subscribe(() => {
        this.agreedToTerms = true; // Mark terms as agreed
        this.updatePrivacyCheckbox(); // Update the checkbox state
    });
    dialogRef.componentInstance.disagreed.subscribe(() => {
      this.agreedToTerms = false; // Mark terms as disagreed
      this.updatePrivacyCheckbox(); // Update the checkbox state
    });
  }

  // Open Privacy Policy modal
  viewPolicy() {
    const dialogRef = this.dialog.open(PrivacypolicyComponent);
    dialogRef.componentInstance.agreed.subscribe(() => {
        this.agreedToPrivacy = true; // Mark privacy policy as agreed
        this.updatePrivacyCheckbox(); // Update the checkbox state
    });
    dialogRef.componentInstance.disagreed.subscribe(() => {
      this.agreedToPrivacy = false; // Mark privacy policy as disagreed
      this.updatePrivacyCheckbox(); // Update the checkbox state
    });
  }

  // Update the privacy checkbox state
  updatePrivacyCheckbox() {
    this.registerData.privacy = this.agreedToTerms && this.agreedToPrivacy; // Checkbox is checked only if both are agreed
  }

  // Show a notice about the agreement status
  get agreementNotice(): string {
    const totalAgreements = 2;
    const agreedCount = (this.agreedToTerms ? 1 : 0) + (this.agreedToPrivacy ? 1 : 0);
    return `You have agreed to ${agreedCount}/${totalAgreements} agreements.`;
  }
}