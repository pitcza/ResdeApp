import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'badge', 'age', 'action'];
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  searchQuery: string = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private as: AdminDataService  // Inject the service
  ) {}

  ngOnInit(): void {
    this.fetchUsers();  // Fetch the users when the component initializes
    this.filteredDataSource.filterPredicate = (data: TableElement, filter: string) => {
      const searchTerms = filter.toLowerCase();
      return (
        (data.fname?.toLowerCase().includes(searchTerms) || false) ||
        (data.lname?.toLowerCase().includes(searchTerms) || false) ||
        (data.email?.toLowerCase().includes(searchTerms) || false) ||
        (data.phone?.toLowerCase().includes(searchTerms) || false) ||
        (data.age?.toString().includes(searchTerms) || false)
      );
    };
  }

  ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  // Fetch users from the API
  fetchUsers(): void {
    this.as.getUsers().subscribe(
      (response) => {
        const excludedEmails = ['admin@gmail.com', 'Environment@gmail.com', 'SkAdmin@gmail.com'];  // Emails to exclude intable display
        //Filter out users whose fname is 'User' or 'Agriculural'

        const badgePriority: Record<string, number> = {
          'Top 1': 1,
          'Top 2': 2,
          'Top 3': 3,
          'Top 4': 4,
          'Top 5': 5,
          'Contributor': 6,
          'Newbie': 7
        };
        
        const users = response
          .filter((user: any) => {
            const fnameLower = user.fname.toLowerCase().trim(); //Make sure to trim spaces
            return fnameLower !== 'user' && fnameLower !== 'agriculural' && !excludedEmails.includes(user.email);
          })
          .map((user: any) => ({
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone_number,  // Assuming this field exists in the API
            badge: user.badge,
            age: user.age,
            created_at: user.created_at
          }));
  
        this.filteredDataSource.data = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }  
  // Apply filter based on search query
  applyFilter(): void {
    this.filteredDataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  
  removeUser(userId: number): void {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete API method
        this.as.deleteUser(userId).subscribe(
          (response) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been deleted.',
              icon: 'success',
              confirmButtonColor: '#7f7f7f',
            });
            // Refresh the users list after deletion
            this.fetchUsers();
          },
          (error) => {
            console.error('Error deleting user:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was a problem deleting the user.',
              icon: 'error',
              confirmButtonColor: '#7f7f7f',
            });
          }
        );
      }
    });
  }
  
}

export interface TableElement {
  created_at?: string;
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  badge?: string;
  age?: number;
  id: number;
}
