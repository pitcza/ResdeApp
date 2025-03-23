import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataserviceService } from '../../../services/dataservice.service';
import { group } from 'console';

import { ViewComponent } from '../uploads/view/view.component';
import { EditpostComponent } from '../uploads/editpost/editpost.component';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  displayedColumns: string[] = ['image', 'date', 'category', 'title', 'status', 'action'];
  dataSource: any [] = [];
  id: any|string;
  element: any;

  userPosts: any[] = [];
  postId!: number;
  totalLikes!: number;
  post: any = {};
  likesCount: any;

  isLoading = true;
  loaders = Array(5).fill(null);

  currentContent: string = 'content1';
  isMobile: boolean = false;
  passForm: FormGroup;
  userForm: FormGroup;
  user: any = {};

  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  paginatedPosts: any[] = [];

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
  }

  constructor(
    private authservice: AuthserviceService, 
    private fb: FormBuilder,
    private dataservice: DataserviceService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    this.checkIfMobile();

    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, this.phoneValidator]],
      birthdate: ['', [Validators.required, this.birthdateValidator]],
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

    this.filteredDataSource = new MatTableDataSource<TableElement>([]);
  }

  isMinor: boolean = false;
  calculateAge(): void {
    const birthdate = this.userForm.get('birthdate')?.value;
    if (!birthdate) return;
  
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    if (age < 12) {
      Swal.fire({
        title: "Age Restriction",
        text: "You must be at least 12 years old to have an account.",
        icon: "error",
        confirmButtonColor: "#cc4646",
        confirmButtonText: "OK"
      });
  
      this.userForm.get('birthdate')?.setErrors({ underage: true });
    } else {
      this.userForm.get('birthdate')?.setErrors(null);
    }
  
    // Change email label if age is between 12-17
    if (age >= 12 && age <= 17) {
      this.isMinor = true;
    } else {
      this.isMinor = false;
    }
  }  

  birthdateValidator(control: any): { [key: string]: boolean } | null {
    if (!control.value) return null;
  
    const birthdate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
  
    return age < 12 ? { underage: true } : null;
  }

  fetchUserData(): void {
    this.isLoading = true;

    this.authservice.getUser().subscribe(
      (response) => {
        console.log('Response from API:', response);

        if (response && response.user) {
          const user = response.user;
          this.user = user;
          console.log('User data from API:', user);

          this.userForm.patchValue({
            fname: user.fname || '',
            lname: user.lname || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            birthdate: user.birthdate || '',
            street: user.street || '',
            barangay: user.barangay || '',
            city: user.city || ''
          });

          this.calculateAge();
          console.log('Form after patching:', this.userForm.value);

          this.userForm.markAsPristine();
          this.userForm.markAsUntouched();

          this.cdr.detectChanges();
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
    let value = input.value.replace(/\D/g, '');

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
        return;
      }
  
      Swal.fire({
        title: 'Update Profile',
        text: 'Are you sure you want to update your profile?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#266CA9',
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
              this.fetchUserData();
  
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
    this.passwordErrors.required = !password;
    this.passwordErrors.length = password.length > 0 && password.length < 8; // for at least 8 characters
    this.passwordErrors.capital = !/[A-Z]/.test(password); // for capital letter
    this.passwordErrors.lowercase = !/[a-z]/.test(password); // for small letter
    this.passwordErrors.number = !/\d/.test(password); // for number
    this.passwordErrors.special = !/[!@#$%^&*(),.?":{}|<>]/.test(password); // for special character

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

  // user approved posts
  fetchUserPosts(): void {
    this.dataservice.getUserPosts().subscribe(
      (response) => {
        if (response && response.posts) {
          this.dataSource = response.posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            date: post.created_at,
            image: post.image,
            image_type: post.image_type,
            status: post.status,
            description: post.content,
            total_likes: post.total_likes ?? 0 
          })).sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
          this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);
          this.updatePaginatedPosts();
        } else {
          console.warn('No posts found');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }
  
  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedPosts = this.dataSource.slice(startIndex, startIndex + this.pageSize);
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }  

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
  }

  // EDITING POST POPUP
  editPost(id: number) {
    const dialogRef = this.dialog.open(EditpostComponent, {
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchUserPosts();
    });
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

  // DELETE PROCESS
  deletePost(id: number) {
    Swal.fire({
      title: 'Delete Post?',
      text: 'This action can\'t be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataservice.deletePost(id).subscribe(
          () => {
            this.dataSource = this.dataSource.filter(post => post.id !== id);
            this.filteredDataSource.data = this.filteredDataSource.data.filter(post => post.id !== id);
            this.cdr.detectChanges();
    
            Swal.fire({
              title: 'Post Deleted!',
              text: 'The post has been deleted.',
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f',
              timer: 5000,
              scrollbarPadding: false
            }).then(() => {
              this.fetchUserPosts();
            });
          },
          error => {
            console.error('Error deleting post:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the post.',
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f',
              timer: 5000,
              scrollbarPadding: false
            });
          }
        );
      }
    });
  }

  // for video preview
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;
      
  captureFirstFrame(video: HTMLVideoElement, post: any) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    video.currentTime = 0.1;
    video.addEventListener('seeked', function onSeeked() {
      video.removeEventListener('seeked', onSeeked);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      post.previewImage = canvas.toDataURL('image/png');
    });
  }
}

export interface TableElement {
  image: string;
  image_type?: string;
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
  date: number;
  total_likes?: number;
}