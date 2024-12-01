import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-allposts',
  templateUrl: './allposts.component.html',
  styleUrls: ['./allposts.component.scss']
})
export class AllpostsComponent implements OnInit {

  posts: any[] = [];

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.ds.getAllPosts().subscribe(
      (response) => {
        if (response.posts) {
          console.log('Fetched posts:', response.posts);
          this.posts = response.posts;
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  toggleLike(post: any): void {
    this.ds.likePost(post.id).subscribe(
      (response) => {
        post.liked_by_user = response.liked;
      },
      (error) => {
        console.error('Error liking/unliking post:', error);
      }
    );
  }
}
