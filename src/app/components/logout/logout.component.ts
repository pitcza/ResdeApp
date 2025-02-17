import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../services/authservice.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  @Output() leaveClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  logoutLink: string = '/login-to-resIt';

  constructor(
    private router: Router, 
    private authService: AuthserviceService
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Show success toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Successfully logged out.',
          iconColor: '#689f7a',
          showConfirmButton: false,
          timer: 2000
        });

        this.router.navigate([this.logoutLink]);
      },
      error: (error) => {
        console.error('Logout failed:', error);

        // Show error toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Logout failed!',
          showConfirmButton: false,
          timer: 2000
        });

        // this.router.navigate([this.logoutLink]);
      }
    });
  }

  close() {
    this.closedPopup.emit();
  }
}