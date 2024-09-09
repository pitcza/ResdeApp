import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  ngOnInit(): void {
    // Initial setup
    this.checkElementsInView();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkElementsInView();
  }

  private checkElementsInView(): void {
    const rsContainer = document.querySelector('.rs-container') as HTMLElement;
    const headContent = document.querySelector('.head') as HTMLElement;

    this.toggleInView(rsContainer);
    this.toggleInView(headContent);
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
