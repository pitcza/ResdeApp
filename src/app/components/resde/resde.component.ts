import { Component } from '@angular/core';
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
}
