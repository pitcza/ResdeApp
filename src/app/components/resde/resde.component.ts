import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-resde',
  templateUrl: './resde.component.html',
  styleUrl: './resde.component.scss'
})
export class ResdeComponent {
  isLoginRoute: boolean = false;
  lastScrollTop = 0;
  isHeaderHidden = false;
  scrollThreshold = 10;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ewan pero to hide yung Re'sIt logo sa header if nasa login page kasi may logo ron
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/resIt/login-to-resIt';
      }
    });
  }

  // Scroll detection for hiding/showing header and adjusting bg opacity
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bgElement = document.querySelector('.bg') as HTMLElement;

    // Adjust background opacity based on scroll position
    if (window.scrollY > 0) {
      bgElement.style.opacity = '0.9';
    } else {
      bgElement.style.opacity = '0.7';
    }

    // Ignore small scrolls
    if (Math.abs(this.lastScrollTop - currentScrollTop) <= this.scrollThreshold) {
      return;
    }

    // Hide header when scrolling down, show when scrolling up
    if (currentScrollTop > this.lastScrollTop) {
      this.isHeaderHidden = true;
    } else {
      this.isHeaderHidden = false;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }
}
