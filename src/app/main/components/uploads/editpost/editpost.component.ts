import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent implements OnInit {
  postData: any = null; 
  id: string | null = null;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ds: DataserviceService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Retrieved post ID:', this.id);
  
    const numericId = this.id ? Number(this.id) : null;
    if (numericId !== null) {
      this.ds.getPost(numericId).subscribe(
        (data) => {
          this.postData = data;
          console.log('Fetched post data:', this.postData); 
        },
        (error) => {
          console.error('Error fetching post data:', error);
        }
      );
    }
  }

  // if trip lagyan hehe nakacomment sa html
  ImagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.ImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Confirmation function
  updatePost() {
    Swal.fire({
      title: 'Update Post',
      text: `Are you sure you want to update your post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['main/uploads/list']); 
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          text: 'Post has been updated.',
        });
    }
    });
  }

}
