import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener, ViewEncapsulation, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements AfterViewInit, OnInit {
  private galleryContainer: HTMLElement | null = null;
  private galleryControlsContainer: HTMLElement | null = null;
  private galleryItems: NodeListOf<Element> = document.querySelectorAll('.gallery-item');
  private galleryControls: string[] = ['previous', 'next'];
  landingPhotos: string[] = []; // Store fetched images

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminPhotos: DataserviceService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkElementsInView();
      this.fetchLandingPhotos(); // Fetch images from API
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.galleryContainer = document.querySelector('.gallery-container') as HTMLElement;
      this.galleryControlsContainer = document.querySelector('.gallery-controls') as HTMLElement;
      
      // Delay initialization to ensure images are available
      setTimeout(() => {
        this.galleryItems = document.querySelectorAll('.gallery-item');
  
        if (this.galleryContainer && this.galleryControlsContainer && this.galleryItems.length > 0) {
          const exampleCarousel = new Carousel(this.galleryContainer, this.galleryControlsContainer, this.galleryItems, this.galleryControls);
          exampleCarousel.setControls();
          exampleCarousel.useControls();
        }
      }, 500); // Delay execution to allow images to load
    }
  }

  fetchLandingPhotos(): void {
    this.adminPhotos.getLandingPhotos().subscribe({
      next: (response) => {
        if (response.length > 0) {
          // Get the most recent images (assuming the API returns them in ascending order)
          this.landingPhotos = response[0].images.slice(-5).reverse(); 
        }
      },
      error: (error) => {
        console.error('Error fetching landing photos:', error);
      }
    });
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


class Carousel {
  private carouselContainer: HTMLElement;
  private carouselControlsContainer: HTMLElement;
  private carouselControls: string[];
  private carouselArray: HTMLElement[];
  private autoSlideInterval: any;

  constructor(container: HTMLElement, controlsContainer: HTMLElement, items: NodeListOf<Element>, controls: string[]) {
    this.carouselContainer = container;
    this.carouselControlsContainer = controlsContainer;
    this.carouselControls = controls;
    this.carouselArray = Array.from(items) as HTMLElement[];

    this.startAutoSlide();
  }

  private updateGallery(): void {
    this.carouselArray.forEach(el => {
      for (let i = 1; i <= 5; i++) {
        el.classList.remove(`gallery-item-${i}`);
      }
    });

    this.carouselArray.slice(0, 5).forEach((el, i) => {
      el.classList.add(`gallery-item-${i + 1}`);
    });
  }

  private setCurrentState(direction: HTMLElement): void {
    if (direction.classList.contains('gallery-controls-previous')) {
      this.carouselArray.unshift(this.carouselArray.pop() as HTMLElement);
    } else {
      this.carouselArray.push(this.carouselArray.shift() as HTMLElement);
    }
    this.updateGallery();
  }

  setControls(): void {
    if (!this.carouselControlsContainer) return;
  
    this.carouselControlsContainer.innerHTML = ''; // Clear previous buttons
  
    this.carouselControls.forEach(control => {
      const button = document.createElement('button');
      button.className = `gallery-controls-${control}`;
  
      // Create icon element
      const icon = document.createElement('i');
      icon.className = control === 'previous' ? 'bx bx-chevron-left' : 'bx bx-chevron-right';
  
      // Append icon inside button
      button.appendChild(icon);
      this.carouselControlsContainer.appendChild(button);
    });
  }

  useControls(): void {
    const triggers = Array.from(this.carouselControlsContainer.querySelectorAll('button')) as HTMLElement[];
  
    if (triggers.length === 0) {
      console.error('Carousel controls not found.');
      return;
    }
  
    triggers.forEach(control => {
      control.addEventListener('click', (e) => {
        e.preventDefault();
        this.setCurrentState(control);
        this.resetAutoSlide(); // Reset auto-slide when manually navigating
      });
    });
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      const nextButton = this.carouselControlsContainer.querySelector('.gallery-controls-next') as HTMLElement;
      if (nextButton) {
        this.setCurrentState(nextButton);
      }
    }, 5000); // Move to next every 5 seconds
  }

  private resetAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide(); // Restart the interval
  }
}
