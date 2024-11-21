import { Component, HostListener, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../../../services/dataservice.service';
import { group } from 'console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  // to store which content to show (default to 'content1')
  currentContent: string = 'content1';
  isMobile: boolean = false;
  updateForm: FormGroup;
  passForm: FormGroup
  user: any = {};

  ngOnInit(): void {
      this.dataservice.getUser().subscribe(
        (response) => {
          this.user = response;
        },
        (error) => {
          console.error('Error fetching user data', error); 
        }
      );
    }

  constructor(
      private authservice: AuthserviceService, 
      private fb: FormBuilder,
      private dataservice: DataserviceService
    ) {
      this.checkIfMobile();

      this.updateForm = this.fb.group({
        fname: ['', [Validators.required]],
        lname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone_number: ['', [Validators.pattern('^[0-9+()-\s]*$')]],
        city: ['', [Validators.required]],
        barangay: ['', [Validators.required]],
 
      });

      this.passForm = this.fb.group({
        currentPassword: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        new_password_confirmation: ['', [Validators.required]],
      }, {
        validator: this.passwordMatchValidator, 
      });
      
    }

    passwordMatchValidator(group: FormGroup) {
      const passwordControl = group.get('new_password');
      const passwordConfirmationControl = group.get('new_password_confirmation');
      
      const new_password = passwordControl ? passwordControl.value : '';
      const new_passwordConfirmation = passwordConfirmationControl ? passwordConfirmationControl.value : '';
      
      return new_password === new_passwordConfirmation ? null : { mismatch: true };
    }

  // Check if the screen width is 480px or less
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 480;
  }

  showContent1() {
    this.currentContent = 'content1';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showContent2() {
    this.currentContent = 'content2';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showContent3() {
    this.currentContent = 'content3';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (this.updateForm.valid) {
     
      const formData = this.updateForm.value;
      formData.phone_number = formData.phone_number ? formData.phone_number.toString() : '';
      

      this.authservice.updateUser(this.updateForm.value).subscribe(
        response => {
          console.log('Update successful:', response);
          alert('User information updated successfully!');
        },
        error => {
          console.error('Error updating user information:', error);
        }
      );
    }
  }

  onPasswordChange() {
    if (this.passForm.valid) {
      const passwordData = this.passForm.value;

      this.authservice.verifyCurrentPassword(passwordData.currentPassword).subscribe(
        response => {
          if (response.passwordValid) { 
            this.authservice.changePassword(passwordData).subscribe(
              changeResponse => {
                console.log('Password change successful:', changeResponse);
                alert('Password changed successfully!');
              },
              error => {
                console.error('Error changing password:', error);
              }
            );
          } else {
            alert('Current password is incorrect.');
          }
        },
        error => {
          console.error('Error verifying current password:', error);
          alert('Error verifying current password.');
        }
      );
    } else if (this.passForm.hasError('mismatch')) {
      alert('New password and confirm password do not match.');
    }
  }
  

}

