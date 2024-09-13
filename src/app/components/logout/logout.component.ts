import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  @Output() leaveClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  constructor(private router: Router) {
    this.updateLogoutLink();
  }

  logoutLink: string = '/login-to-resIt';

  updateLogoutLink(): void {
    // const currentRoute = this.router.url;

    // if (currentRoute.startsWith('/admin')) {
    //   this.logoutLink = '/admin-login';
    // } else if (currentRoute.startsWith('/main')) {
    //   this.logoutLink = '/login-to-resIt';
    // }
  }

  close() {
    this.closedPopup.emit();
  }

  onLeaveClick() {
    this.leaveClicked.emit();
  }
}
