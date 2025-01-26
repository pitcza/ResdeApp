import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkElementsInView();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkElementsInView();
    }
    
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (window.scrollY > 300) {
      scrollTopButton?.classList.add('show');
    } else {
      scrollTopButton?.classList.remove('show');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private checkElementsInView(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elementsToAnimate = document.querySelectorAll('.rs-container, .head, .left, .right') as NodeListOf<HTMLElement>;

      elementsToAnimate.forEach((element) => {
        this.toggleInView(element);
      });
    }
  }

  private toggleInView(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      element.classList.add('in-view');
    } else {
      element.classList.remove('in-view');
    }
  }
}