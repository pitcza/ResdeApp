import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agri-expert',
  templateUrl: './agri-expert.component.html',
  styleUrl: './agri-expert.component.scss'
})
export class AgriExpertComponent {
  name: string = '';

  ngOnInit(): void {
    this.updateNameFromSessionStorage();
  }

  updateNameFromSessionStorage(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.name = sessionStorage.getItem('name') || '';
    } else {
      this.name = '';
    }
  }
  
  updateUsername(newName: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('name', newName);
      this.updateNameFromSessionStorage();
    } else {
      console.warn('sessionStorage is not available.');
    }
  }

  constructor(
    private router: Router,
  ) {
    this.checkScreenWidth();
  }
  
  // SIDEBAR
  isSidebarCollapsed = false;
  isSidebarOverlay = false;
  isSidebarToggled = false;

  toggleSidebar() {
    this.isSidebarToggled = !this.isSidebarToggled;
    if (window.innerWidth <= 1024) {
      if (this.isSidebarOverlay) {
        this.isSidebarOverlay = false;
        this.isSidebarCollapsed = true;
      } else {
        this.isSidebarOverlay = true;
        this.isSidebarCollapsed = false;
      }
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      this.isSidebarOverlay = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1024) {
        this.isSidebarCollapsed = true;
        this.isSidebarOverlay = false;
      } else {
        this.isSidebarCollapsed = screenWidth <= 1320;
        this.isSidebarOverlay = false;
      }
    }
  }

  // LOGOUT
  showPopup: boolean = false;

  logoutPopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

 protected logout() {
      next: (res: any) => {
        sessionStorage.clear();
        this.router.navigate(['login']); 
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Logged out successfully"
        });
      }
  } 
}
