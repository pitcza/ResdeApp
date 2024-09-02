import { Component } from '@angular/core';

@Component({
  selector: 'app-likedposts',
  templateUrl: './likedposts.component.html',
  styleUrl: './likedposts.component.scss'
})
export class LikedpostsComponent {
  items: Item[] = [
    {
      title: 'Newest Article',
      category: 'Technology',
      author: 'John Doe',
      date: '2024-08-18',
      image: '../../../../assets/images/NoImage.png',
      description: 'This is the description for the newest article. This is the description for the newest article. This is the description for the newest article. This is the description for the newest article. This is the description for the newest article. This is the description for the newest article.'
    },
    {
      title: 'Sample Title of Posted Idea One Two Three Four',
      category: 'Science',
      author: 'Jane Smith',
      date: '2024-08-17',
      image: '../../../../assets/images/AppLogo.png',
      description: 'This is the description for another article.'
    },
    {
      title: 'Sample Title of Posted Idea One Two Three Four Five Six Seven',
      category: 'Science',
      author: 'Jane Smith',
      date: '2024-08-17',
      image: '../../../../assets/images/clipart.png',
      description: 'This is the description for another article.'
    },
    // Add more items as needed
  ];

  selectedItem: Item = this.items[0];

  constructor() {}

  ngOnInit(): void {}

  selectItem(item: Item): void {
    this.selectedItem = item;
  }

}

interface Item {
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  description: string;
}