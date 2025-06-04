import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener, ViewEncapsulation, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataserviceService } from '../../../services/dataservice.service';
import { ClickableRsComponent } from './clickable-rs/clickable-rs.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../services/admin-data.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements AfterViewInit, OnInit {
  private galleryContainer: HTMLElement | null = null;
  private galleryControlsContainer: HTMLElement | null = null;
  private galleryItems: NodeListOf<Element> = [] as unknown as NodeListOf<Element>; // Delay initialization
  private galleryControls: string[] = ['previous', 'next'];
  landingPhotos: string[] = []; // Store fetched images
  photoContent: string[] = []; // Store fetched contents
  defaultImage = '../../../../assets/images/NoImage.png';
  totalVisit: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private adminPhotos: AdminDataService,
    private http: HttpClient,
    private DS: DataserviceService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkElementsInView();
      this.fetchLatestPhotos(); // Fetch images from API
    }
     this.incrementVisitCount();
     this.getTotalVisit();
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
      }, 300); // Delay execution to allow images to load
    }
  }

  // incrementVisitCount(): void {
  //   this.DS.VisitCount().subscribe({
  //     next: (response) => console.log('Visit incremented:', response),
  //     error: (err) => console.error('Error incrementing visit:', err),
  //   });
  // }

  incrementVisitCount(): void {
    const visited = sessionStorage.getItem('landingPageVisited');

    if (!visited) {
      this.DS.VisitCount().subscribe({
        next: (response) => {
          console.log('Visit incremented:', response);
          sessionStorage.setItem('landingPageVisited', 'true');
        },
        error: (err) => console.error('Error visit:', err),
      });
    } else {
      // console.log('Nabisita na to ni user renze ');
    }
  }

  // getTotalVisit(): void {
  //   this.DS.getVisitCount().subscribe(
  //     (response) => {
  //       this.totalVisit = response.total_visits;
  //       // console.log('Data: ', response);
  //     }
  //   );
  // }

  getTotalVisit(): void {
    this.DS.getVisitCount().subscribe((response) => {
      const targetValue = response.total_visits; 
      this.totalVisit = 0; 

      const increment = Math.ceil(targetValue / 85); 
      const interval = setInterval(() => {
        if (this.totalVisit < targetValue) {
          this.totalVisit = Math.min(this.totalVisit + increment, targetValue);
        } else {
          clearInterval(interval); 
        }
      }, 10); 
    });
  }

  fetchLatestPhotos(): void {
    this.adminPhotos.getLandingPhotos().subscribe({
      next: (response) => {
        if (response.data) {
          const latestPhoto = response.data;
  
          this.landingPhotos = [
            latestPhoto.image1 ? latestPhoto.image1 : this.defaultImage,
            latestPhoto.image2 ? latestPhoto.image2 : this.defaultImage,
            latestPhoto.image3 ? latestPhoto.image3 : this.defaultImage,
            latestPhoto.image4 ? latestPhoto.image4 : this.defaultImage,
            latestPhoto.image5 ? latestPhoto.image5 : this.defaultImage
          ];
  
          this.photoContent = [
            latestPhoto.content1 ? latestPhoto.content1 : 'No description available',
            latestPhoto.content2 ? latestPhoto.content2 : 'No description available',
            latestPhoto.content3 ? latestPhoto.content3 : 'No description available',
            latestPhoto.content4 ? latestPhoto.content4 : 'No description available',
            latestPhoto.content5 ? latestPhoto.content5 : 'No description available'
          ];
        } else {
          this.landingPhotos = Array(5).fill(this.defaultImage);
          this.photoContent = Array(5).fill('No description available');
        }
      },
      error: (error) => {
        console.error('Error fetching latest photo:', error);
        this.landingPhotos = Array(5).fill(this.defaultImage);
        this.photoContent = Array(5).fill('No description available');
      }
    });
  }
  
  

  getPhotos(): string[] {
    const defaultPhotos = [
      '../../../../assets/images/NoImage.png',
      '../../../../assets/images/NoImage.png',
      '../../../../assets/images/NoImage.png',
      '../../../../assets/images/NoImage.png',
      '../../../../assets/images/NoImage.png'
    ];

    // Ensure we have at least 5 images, fill the rest with default ones
    return this.landingPhotos.length >= 5
      ? this.landingPhotos.slice(0, 5)
      : [...this.landingPhotos, ...defaultPhotos.slice(this.landingPhotos.length)];
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkElementsInView();

      const scrollTopButton = document.getElementById('scrollTopButton');
      if (scrollTopButton) {
        if (window.scrollY > 300) {
          scrollTopButton.classList.add('show');
        } else {
          scrollTopButton.classList.remove('show');
        }
      }
    }
  }

  showCardContent(type: string): void {
    if (this.dialog) {
      this.dialog.open(ClickableRsComponent, {
        data: { type },  // Pass the type (reduce, reuse, recycle)
      });
    } else {
      console.error('Dialog component not found');
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    }, 10000); // Move to next every 10 seconds
  }

  private resetAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide(); // Restart the interval
  }
}
