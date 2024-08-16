import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-resde',
  templateUrl: './resde.component.html',
  styleUrl: './resde.component.scss'
})
export class ResdeComponent {
  // showHeader = true;

  // constructor(private router: Router) {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.showHeader = this.router.url !== '/login';
  //     }
  //   });
  // }
}
