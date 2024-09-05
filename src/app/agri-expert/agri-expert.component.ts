import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agri-expert',
  templateUrl: './agri-expert.component.html',
  styleUrl: './agri-expert.component.scss'
})
export class AgriExpertComponent {
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
