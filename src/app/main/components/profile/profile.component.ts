import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../../../services/dataservice.service';
import { group } from 'console';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from '../uploads/view/view.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  // to store which content to show (default to 'content1')
  displayedColumns: string[] = ['image', 'date', 'category', 'title', 'status', 'action'];
  dataSource: any [] = [];
  id: any|string;
  element: any;

  isLoading = true;
  loaders = Array(5).fill(null);

  currentContent: string = 'content1';
  isMobile: boolean = false;
  updateForm: FormGroup;
  passForm: FormGroup
  user: any = {};

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

  initialUser: any = {}; // To store the initial user data

  userPosts: any[] = []; // Define the userPosts array here
  
  ngOnInit(): void {
    this.fetchUserPost();
    this.dataservice.getUserPosts().subscribe(
      (posts) => {
        this.userPosts = posts;
      },
      (error) => {
        console.error('Error fetching user posts', error);
      }
    );
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
      private dataservice: DataserviceService,
      private cdr: ChangeDetectorRef,
      private dialog: MatDialog,
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

  totalLikes: number = 0;

  fetchUserPost(): void {
    this.dataservice.getUserPosts().subscribe(
      (response) => {
        this.dataSource = response.posts
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          category: post.category,
          date: post.created_at,
          image: post.image,
          status: post.status,
          description: post.content,
          total_likes: post.total_likes ?? 0
        }))
        .sort((a: { date: string | undefined }, b: { date: string | undefined }) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA; // Sort in descending order (newest first)
        });

        console.log(response)
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
  }

  // VIEWING POST POPUP
    viewPost(id: number) {
      if (this.dialog) {
        this.dialog.open(ViewComponent, {
          data: { id: id }  
        });
      } else {
        console.error('View popup not found');
      }
    }
}

