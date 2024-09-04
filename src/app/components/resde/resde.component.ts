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
    // ewan pero to hide yung Re'sIt logo sa header if nasa login page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/resIt/login-to-resIt';
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const bgElement = document.querySelector('.bg') as HTMLElement;
    
    if (window.scrollY > 0) {
      bgElement.style.opacity = '0.9';
    } else {
      bgElement.style.opacity = '0.0';
    }
  }
}
