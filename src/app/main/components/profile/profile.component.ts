import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // to store which content to show (default to 'content1')
  currentContent: string = 'content1';
  isMobile: boolean = false;

  constructor() {
    this.checkIfMobile();
  }

  // Check if the screen width is 480px or less
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 480;
  }

  showContent1() {
    this.currentContent = 'content1';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showContent2() {
    this.currentContent = 'content2';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showContent3() {
    this.currentContent = 'content3';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
