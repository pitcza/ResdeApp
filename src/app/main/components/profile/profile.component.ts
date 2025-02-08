import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../../../services/dataservice.service';
import { group } from 'console';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from '../uploads/view/view.component';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  displayedColumns: string[] = ['image', 'date', 'category', 'title', 'status', 'action'];
  dataSource: any [] = [];
  id: any|string;
  element: any;

  userPosts: any[] = [];
  postId!: number; // Holds the post ID
  totalLikes!: number; // Holds the total likes for the post
  post: any = {}; // Holds the post data
  likesCount: any;

  isLoading = true;
  loaders = Array(5).fill(null);

  currentContent: string = 'content1';
  isMobile: boolean = false;
  passForm: FormGroup;
  userForm: FormGroup;
  user: any = {};

  ages: number[] = Array.from({ length: 89 }, (_, i) => i + 12);
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
  
  ngOnInit(): void {
    this.fetchUserData();
    this.dataservice.getUserPosts().subscribe(
      (posts) => {
        this.userPosts = posts;
      },
      (error) => {
        console.error('Error fetching user posts', error);
      }
    );
    this.fetchUserPosts();
    this.getUserTotalLikes()
  }

  constructor(
    private authservice: AuthserviceService, 
    private fb: FormBuilder,
    private dataservice: DataserviceService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private AS: AdminDataService
  ) {
    this.checkIfMobile();

    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, this.phoneValidator]],
      age: ['', [Validators.required, this.ageValidator]],
      street: ['', Validators.required],
      barangay: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required]
    });
    this.fetchUserData();

    this.passForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator, 
    });
    
    this.passForm.controls['new_password'].valueChanges.subscribe(() => {
      this.validatePassword();
    });
  }

  fetchUserData(): void {
    this.isLoading = true;

    this.authservice.getUser().subscribe(
        (response) => {
          console.log('Response from API:', response);

          if (response && response.user) {
            const user = response.user;
            this.user = user;

            // Log user data before patching
            console.log('User data from API:', user);

            this.userForm.patchValue({
              fname: user.fname || '',
              lname: user.lname || '',
              email: user.email || '',
              phone_number: user.phone_number || '',
              age: user.age || '',
              street: user.street || '',
              barangay: user.barangay || '',
              city: user.city || ''
            });

            console.log('Form after patching:', this.userForm.value);

            // Mark form as pristine to prevent unnecessary validation
            this.userForm.markAsPristine();
            this.userForm.markAsUntouched();

            this.cdr.detectChanges(); // Ensure UI updates
          } else {
            console.warn('Unexpected response format:', response);
          }

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.isLoading = false;
          Swal.fire('Error', 'Failed to load user data.', 'error');
        }
    );
  }

  // age validations
  ageValidator(control: any): { [key: string]: boolean } | null {
    const age = Number(control.value);
    if (isNaN(age) || age < 12 || age > 100) {
      return { invalidAge: true };
    }
    return null;
  }

  isAgeValid(): boolean {
    return this.userForm.get('age')?.valid ?? false;
  }

  phoneValidator(control: any): { [key: string]: boolean } | null {
    const phonePattern = /^\+63\s\d{3}-\d{3}-\d{4}$/; // +63 XXX-XXX-XXXX format
    if (!phonePattern.test(control.value)) {
      return { invalidPhone: true }; 
    }
    return null;
  }
  
  // phone number validations
  onPhoneNumberInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.startsWith('63')) {
      value = value.substring(2); // Remove '63' if manually entered
    } else if (value.startsWith('0')) {
      value = value.substring(1); // Remove leading '0'
    }

    // Ensure the first digit after +63 is always '9'
    if (value.length > 0 && value[0] !== '9') {
      value = '9' + value.substring(1);
    }

    // Format as +63 9XX-XXX-XXXX
    let formattedNumber = '+63 ';
    if (value.length > 0) formattedNumber += value.slice(0, 3);
    if (value.length > 3) formattedNumber += '-' + value.slice(3, 6);
    if (value.length > 6) formattedNumber += '-' + value.slice(6, 10);

    input.value = formattedNumber;

    this.userForm.controls['phone_number'].setValue(formattedNumber);
    this.userForm.controls['phone_number'].updateValueAndValidity();
  }

  // for content 2
  updateUserData(): void {
    if (this.userForm.valid) {
      if (!this.userForm.dirty) {
        Swal.fire('No Changes', 'No updates were made to your profile.', 'info');
        return; // Prevent unnecessary API call
      }
  
      Swal.fire({
        title: 'Update Profile',
        text: 'Are you sure you want to update your profile?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#7f7f7f',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          const userData = this.userForm.value;
          console.log('Submitting Updated User Data:', userData);
  
          this.authservice.updateUser(userData).subscribe(
            (response) => {
              console.log('User data updated successfully:', response);
              Swal.fire({
                title: "Profile Updated!",
                text: "Your profile has been updated successfully.",
                icon: "success",
                confirmButtonText: 'Close',
                confirmButtonColor: "#7f7f7f",
                timer: 5000,
              });
  
              this.userForm.markAsPristine(); // Reset form state to disable button
              this.userForm.markAsUntouched();
            },
            (error) => {
              console.error('Error updating user data:', error);
              Swal.fire('Error', 'There was a problem updating your profile.', 'error');
            }
          );
        }
      });
    } else {
      console.warn('Form is invalid:', this.userForm);
      this.userForm.markAllAsTouched();
    }
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
    const password = this.passForm.controls['new_password'].value || '';
  
    // error flags
    this.passwordErrors.required = !password;
    this.passwordErrors.length = password.length > 0 && password.length < 8; // for at least 8 characters
    this.passwordErrors.capital = !/[A-Z]/.test(password); // for capital letter
    this.passwordErrors.lowercase = !/[a-z]/.test(password); // for small letter
    this.passwordErrors.number = !/\d/.test(password); // for number
    this.passwordErrors.special = !/[!@#$%^&*(),.?":{}|<>]/.test(password); // for special character

    // Mark the password field as invalid if any error exists
    this.passForm.controls['new_password'].setErrors(
      Object.values(this.passwordErrors).some(error => error) ? { invalidPassword: true } : null
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('new_password');
    const passwordConfirmationControl = group.get('new_password_confirmation');
    
    const new_password = passwordControl ? passwordControl.value : '';
    const new_passwordConfirmation = passwordConfirmationControl ? passwordConfirmationControl.value : '';
    
    return new_password === new_passwordConfirmation ? null : { mismatch: true };
  }
  // end of password validations

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


  // for mobile view
  // check if the screen width is 480px or less
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

  // totalLikes: number = 0;

  // user approved posts
  fetchUserPosts(): void {
    this.dataservice.getUserPosts().subscribe(
      (response) => {
        console.log('Fetched Posts:', response);  // Log the response

        if (response && response.posts) {
          this.dataSource = (response.posts || [])
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
              return dateB - dateA;
            });

          this.isLoading = false;
        } else {
          console.warn('No posts found in the response:', response);
          this.isLoading = false;
        }

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  getUserTotalLikes(): void {
    this.AS.likedposttable().subscribe(
      (response) => {
        const likedPosts = response['posts'] || [];

        // Update the likes_count for the posts in dataSource
        likedPosts.forEach((likedPost: any) => {
          const post = this.dataSource.find(p => p.id === likedPost.post_id);
          if (post) {
            post.total_likes = likedPost.likes_count; // Update the likes_count value
          }
        });

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts for table and chart', error);
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

  fetchPostLikes(postId: number): void {
    this.dataservice.getUserLikes(postId).subscribe({
      next: (response) => {
        this.totalLikes = response.total_likes; 
        this.post = response;
      },
      error: (err) => {
        console.error('Error fetching likes:', err);
      },
    });
  }
}

