import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthserviceService } from '../../../services/authservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  constructor(
    private router: Router,
    private authService: AuthserviceService
  ) { }

  email: string = '';
  token: string = '';
  enterCodePopup = false;
  verificationCode: string = '';
  isCodeVerified = false;

  newpassVisible = false;
  confirmnewpassVisible = false;

  newPassword: string = '';
  confirmNewPassword: string = '';

  passwordErrors = {
    required: false,
    length: false,
    capital: false,
    lowercase: false,
    number: false,
    special: false
  };

  toggleNewPassVisibility() {
    this.newpassVisible = !this.newpassVisible;
  }

  toggleConfirmNewPassVisibility() {
    this.confirmnewpassVisible = !this.confirmnewpassVisible;
  }

  sendCode() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter a valid email address.', 'error');
      return;
    }

    const swalLoading = Swal.fire({
      title: 'Sending...',
      text: `Please wait while we send the verification code to ${this.email}`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.forgotPassword(this.email).subscribe(
      (response) => {
        this.enterCodePopup = true;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          iconColor: '#689f7a',
          title: 'Verification code sent to your email.',
          showConfirmButton: false,
          timer: 7000,
          timerProgressBar: true,
        });
      },
      (error) => {
        Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
      }
    );
  }

  confirmCancel(type: string) {
    Swal.fire({
      title: 'Cancel Process',
      text: 'Are you sure you want to cancel? Any progress will be lost.',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#cc4646',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep Going',
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'email') {
          // Reset form inputs
          this.email = '';
          this.router.navigate(['/login-to-resIt']);
        } else if (type === 'code') {
          this.enterCodePopup = false; // Close the verification popup
          this.verificationCode = '';
        }
      }
    });
  }  

  verifyCode() {
    if (!this.verificationCode) {
      Swal.fire('Error', 'Please enter the verification code.', 'error');
      return;
    }

    const swalLoading = Swal.fire({
      title: 'Verifying...',
      text: `Please wait while we verify the code you entered.`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.verifyResetToken(this.email, this.verificationCode).subscribe(
      (response) => {
        // swalLoading.close(); // Close the loading Swal
        this.isCodeVerified = true; // Code verified
        this.token = this.verificationCode; // Store token for password reset
        Swal.fire('Success', 'Code verified successfully.', 'success');
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          iconColor: '#689f7a',
          text: 'Code verified successfully. You can finally create your new password.',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      },
      (error) => {
        // swalLoading.close(); // Close the loading Swal
        Swal.fire('Error', 'Invalid or expired verification code.', 'error');
      }
    );
  }

  validatePassword(): void {
    const password = this.newPassword;
    this.passwordErrors.required = !password;
    this.passwordErrors.length = password.length > 0 && password.length < 8;
    this.passwordErrors.capital = !/[A-Z]/.test(password);
    this.passwordErrors.lowercase = !/[a-z]/.test(password);
    this.passwordErrors.number = !/\d/.test(password);
    this.passwordErrors.special = !/[!@#$%^&*(),.?":{}|<>]/.test(password);
  }  

  // without auto login
  resetPassword() {
    // Validate password requirements
    this.validatePassword();

    // If there are validation errors, show the corresponding error message
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

    if (this.newPassword !== this.confirmNewPassword) {
      Swal.fire('Error', 'Passwords do not match.', 'error');
      return;
    }

    const passwordData = {
      email: this.email,
      token: this.token,
      password: this.newPassword,
      password_confirmation: this.confirmNewPassword
    };

    const swalLoading = Swal.fire({
      title: 'Resetting password...',
      text: `Please wait while we reset your password.`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.resetPassword(this.email, this.token, passwordData).subscribe(
      (response) => {
        // Swal.close();
        // Swal.fire('Success', 'Your password has been reset successfully.', 'success');
        // Swal.fire({
        //   toast: true,
        //   position: 'top-end',
        //   icon: 'success',
        //   title: 'Your password has been reset successfully.',
        //   showConfirmButton: false,
        //   timer: 5000,
        //   timerProgressBar: true,
        // });
        this.router.navigate(['/login-to-resIt'], {
          queryParams: { email: this.email, password: this.newPassword }
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to reset password. Please try again later.', 'error');
      }
    );
  }


  // with auto login sa back, ayaw makuha pwede naman pala sa ts lang
  // resetPassword() {
  //   if (!this.newPassword || !this.confirmNewPassword) {
  //     Swal.fire('Error', 'Please fill in both password fields.', 'error');
  //     return;
  //   }
  
  //   if (this.newPassword !== this.confirmNewPassword) {
  //     Swal.fire('Error', 'Passwords do not match.', 'error');
  //     return;
  //   }
  
  //   const swalLoading = Swal.fire({
  //     title: 'Resetting...',
  //     text: 'Please wait while we reset your password.',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });
  
  //   this.authService.resetPasswordAndLogin(this.email, this.newPassword, this.token).subscribe(
  //     (response) => {
  //       Swal.close();  // Close the loading Swal
  //       Swal.fire('Success', 'Password reset successful, and you are now logged in!', 'success');
  //       this.router.navigate(['/main']); // Navigate to the main page
  //     },
  //     (error) => {
  //       Swal.close();  // Close the loading Swal
  //       Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
  //     }
  //   );
  // }

}
