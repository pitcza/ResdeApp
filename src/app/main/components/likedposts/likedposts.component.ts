import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-likedposts',
  templateUrl: './likedposts.component.html',
  styleUrls: ['./likedposts.component.scss'],
})
export class LikedpostsComponent implements OnInit {
  likedPosts: any[] = [];
  items: Item[] = [];
  paginatedItems: Item[] = [];
  selectedItem: Item = {
    title: '',
    category: '',
    materials: '',
    author: '',
    date: '',
    post_date: '',
    image: '',
    image_type: '',
    description: '',
    id: 0,
    total_likes: 0,
    liked: false
  };
  isLoading = true;
  pageSize = 5;
  currentPage = 1;

  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;
      
  captureFirstFrame(video: HTMLVideoElement, post: any) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    video.currentTime = 0.1;
    video.addEventListener('seeked', function onSeeked() {
      video.removeEventListener('seeked', onSeeked);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      post.previewImage = canvas.toDataURL('image/png');
    });
  }

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.fetchLikedPosts();
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  fetchLikedPosts(): void {
    this.isLoading = true;
  
    this.ds.getLikedPosts().subscribe({
      next: (response) => {
        this.items = response.liked_posts.map((post: any) => ({
          id: post.id,
          title: post.title || 'Untitled',
          category: post.category || 'Uncategorized',
          materials: post.materials || 'No materials listed',
          author: post.user_name || 'Unknown',
          post_date: post.created_at || '',
          image: post.image || '../../../../assets/images/default-placeholder.png',
          image_type: post.image_type || 'image', // Determine file type
          description: post.content || '',
          total_likes: post.total_likes,
          date: post.liked_at || '',
          liked: post.liked || false,
        }));
  
        this.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
        this.updatePaginatedItems();
        this.selectedItem = this.items.length > 0 ? this.items[0] : this.selectedItem;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching liked posts:', error);
        this.isLoading = false;
      }
    });
  }   

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.items.slice(startIndex, startIndex + this.pageSize);
  }

  selectItem(item: Item): void {
    this.selectedItem = item;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.items.length) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  toggleLike(post: Item, event: Event): void {
    event.stopPropagation(); // Prevents triggering the selectItem function
  
    this.ds.toggleLike(post.id).subscribe(
      (response: any) => {
        post.liked = !post.liked; // Toggle UI state
        post.total_likes = response.total_likes; // Update total likes dynamically
      },
      (error) => {
        console.error('Error toggling like:', error);
      }
    );
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
  }

  formatMaterials(materials: string): string {
    try {
        const parsedMaterials = JSON.parse(materials);
        return Array.isArray(parsedMaterials) ? parsedMaterials.join(', ') : 'No materials listed.';
    } catch {
        return 'No materials listed.';
    }
  }
}

interface Item {
  id: number;
  title: string;
  category: string;
  materials: string;
  author: string;
  date: string;
  post_date: string;
  image: string;
  image_type: string;
  description: string;
  total_likes: number;
  liked: boolean; 
}


