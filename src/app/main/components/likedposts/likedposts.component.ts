import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-likedposts',
  templateUrl: './likedposts.component.html',
  styleUrls: ['./likedposts.component.scss'],
})
export class LikedpostsComponent implements OnInit {
  items: Item[] = [];
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

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.loadLikedPosts();
  }

  loadLikedPosts(): void {
    this.ds.userLiked().subscribe(
      (response) => {
        this.items = response.liked_posts.map((post: any) => ({
          id: post.id, 
          title: post.title,
          category: post.category,
          author: post.user_name,
          date: post.created_at,
          image: post.image,
          description: post.content,
          liked: post.liked || false, 
        }));
  
        if (this.items.length > 0) {
          this.selectedItem = this.items[0];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching liked posts:', error);
        this.isLoading = false;
      }
    );
  }
  

  likePost(postId: number): void {
    this.ds.likePost(postId).subscribe(
      (response) => {
        console.log('Post liked:', response);
        
        const likedItem = this.items.find((item) => item.id === postId);
        if (likedItem) likedItem.liked = !likedItem.liked;
  
        if (this.selectedItem.id === postId) {
          this.selectedItem.liked = !this.selectedItem.liked;
        }
      },
      (error) => {
        console.error('Error liking post:', error);
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


