import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-resde',
  templateUrl: './resde.component.html',
  styleUrl: './resde.component.scss'
})
export class ResdeComponent {
  isLoginRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen for navigation end events to determine the current route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/resde/login-to-resde';
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const bgElement = document.querySelector('.bg') as HTMLElement;
    // const hideElement = document.querySelector('.hide') as HTMLElement;
    const headingElement = document.querySelector('h1') as HTMLElement;
    
    if (window.scrollY > 0) {
      bgElement.style.opacity = '0.9';
      // hideElement.style.display = 'none';
      headingElement.style.color = 'var(--dark-green)';
    } else {
      bgElement.style.opacity = '0.0';
      // hideElement.style.display = 'none';
      headingElement.style.color = 'var(--dark-green)';
    }
  }
}
