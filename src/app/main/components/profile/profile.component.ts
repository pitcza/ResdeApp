import { Component, HostListener, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../../../services/dataservice.service';
import { group } from 'console';

import Swal from 'sweetalert2';

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

  initialUser: any = {}; // To store the initial user data

  ngOnInit(): void {
    this.dataservice.getUser().subscribe(
      (response) => {
        this.user = response;
        this.initialUser = { ...response };  // Store the initial data
        this.updateForm.patchValue({
          fname: this.user.fname,
          lname: this.user.lname,
          email: this.user.email,
          phone_number: this.user.phone_number,
          city: this.user.city,
          barangay: this.user.barangay,
          age: this.user.age,
          street: this.user.street
        });
      },
      (error) => {
        console.error('Error fetching user data', error); 
      }
    );
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
        age: ['', [Validators.required]],
        street: ['', [Validators.required]],
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

      // Compare form values with initial values
      if (this.hasFormChanged(formData)) {
        this.authservice.updateUser(formData).subscribe(
          response => {
            console.log('Update successful:', response);
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              iconColor: '#689f7a',
              title: 'Your information updated successfully!',
              showConfirmButton: false,
              timer: 8000,
              timerProgressBar: true,
            });
          },
          error => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Error updating the information.',
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            });
          }
        );
      } else {
        console.log('No changes detected, update skipped.');
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'You have no changes.',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    }
  }

  // Function to compare form values with initial values
  hasFormChanged(formData: any): boolean {
    return Object.keys(formData).some(key => formData[key] !== this.initialUser[key]);
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
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  iconColor: '#689f7a',
                  title: 'Password changed successfully!',
                  showConfirmButton: false,
                  timer: 8000,
                  timerProgressBar: true,
                });
              },
              error => {
                console.error('Error changing password:', error);
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'error',
                  title: 'Error changing password.',
                  showConfirmButton: false,
                  timer: 5000,
                  timerProgressBar: true,
                });
              }
            );
          } else {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Current password is incorrect.',
              showConfirmButton: false,
              timer: 6000,
              timerProgressBar: true,
            });
          }
        },
        error => {
          console.error('Error verifying current password:', error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error verifying current password.',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        }
      );
    } else if (this.passForm.hasError('mismatch')) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'New password and confirm password do not match.',
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
      });
    }
  }
}

