import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  user: User | null = null;

  constructor
  (
    private authService: AuthserviceService
  ) 
  {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getUserData(); // Assuming getUserData() returns a User object
    console.log('User data:', this.user);
  }
  

}

export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  city: string;
  barangay: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

