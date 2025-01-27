import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

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
    private authService: AuthserviceService,
    private cdr: ChangeDetectorRef
  ) {
    this.checkScreenWidth();
  }

  // ngOnInit(): void {
  //   this.name = sessionStorage.getItem('name') || '';
  // }
  
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

  // Visibility states
  isHeaderHidden = false;
  isBottomNavHidden = false;

  lastScrollTop = 0;
  scrollThreshold = 10;

  // Scroll detection
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(this.lastScrollTop - currentScrollTop) <= this.scrollThreshold) {
      return; // Ignore small scrolls
    }

    if (currentScrollTop > this.lastScrollTop) {
      // Scrolling down
      this.isHeaderHidden = true;
      this.isBottomNavHidden = true;
    } else {
      // Scrolling up
      this.isHeaderHidden = false;
      this.isBottomNavHidden = false;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
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
