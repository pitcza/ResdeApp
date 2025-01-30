import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-likedposts',
  templateUrl: './likedposts.component.html',
  styleUrls: ['./likedposts.component.scss'],
})
export class LikedpostsComponent implements OnInit {
  items: Item[] = [];
  paginatedItems: Item[] = [];
  selectedItem: Item = {
    title: '',
    category: '',
    author: '',
    date: '',
    image: '',
    description: '',
    id: 0,
    liked: false
  };
  isLoading = true;
  pageSize = 5;
  currentPage = 1;

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.loadLikedPosts();
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  loadLikedPosts(): void {
    this.ds.userLiked().subscribe(
      (response) => {
        this.items = response.liked_posts
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          category: post.category,
          author: post.user_name,
          date: new Date(post.created_at).toISOString(), // Convert to ISO for sorting
          image: post.image,
          description: post.content,
          liked: post.liked || false,
        }))
        .sort((a: Item, b: Item) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.updatePaginatedItems();
        this.selectedItem = this.items[0] || this.selectedItem;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching liked posts:', error);
        this.isLoading = false;
      }
    );
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.items.slice(startIndex, startIndex + this.pageSize);
  }
  

  likePost(postId: number, event: Event): void {
    event.stopPropagation(); // Prevent parent click event
    this.ds.likePost(postId).subscribe(
      (response) => {
        console.log('Post like toggled:', response);
  
        // Toggle like state for the item
        const index = this.items.findIndex((item) => item.id === postId);
        if (index > -1) {
          const likedItem = this.items[index];
          likedItem.liked = !likedItem.liked;
  
          // Remove from list if unliked
          if (!likedItem.liked) {
            this.items.splice(index, 1);
          }
        }
  
        // Update selectedItem if necessary
        if (this.selectedItem.id === postId && !this.selectedItem.liked) {
          this.selectedItem = this.items[0] || {
            id: 0,
            title: '',
            category: '',
            author: '',
            date: '',
            image: '',
            description: '',
            liked: false,
          };
        }
      },
      (error) => {
        console.error('Error toggling like:', error);
      }
    );
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
}

interface Item {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  description: string;
  liked: boolean; 
}


