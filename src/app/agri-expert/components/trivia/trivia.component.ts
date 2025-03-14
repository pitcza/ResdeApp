import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../services/admin-data.service';
import { CreatetriviaComponent } from './createtrivia/createtrivia.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTriviaComponent } from './edit-trivia/edit-trivia.component';
import { ViewTriviaComponent } from './view-trivia/view-trivia.component';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  displayedColumns: string[] = ['date', 'category', 'title', 'facts', 'action'];
  dataSource!: MatTableDataSource<TriviaQuestion>;
  filteredDataSource: MatTableDataSource<TriviaQuestion> = new MatTableDataSource();

  fromDate: string = '';  
  toDate: string = ''; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (
    private dialog: MatDialog,
    private as: AdminDataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.fetchquestions();
  }

  fetchquestions() {
    this.as.getquestions().subscribe(
      (data: TriviaQuestion[]) => {
        // Sort trivia from oldest to latest by created_at
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
        this.dataSource = new MatTableDataSource(data);
        this.filteredDataSource = new MatTableDataSource(data);
        this.filteredDataSource.paginator = this.paginator;
        this.filteredDataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }
  
  filterPosts() {
    this.filteredDataSource.data = this.dataSource.data.filter(post => {
  
      const postDate = post.created_at ? new Date(post.created_at) : null;  // Check for undefined or null created_at
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;
  
      return fromDateMatch && toDateMatch;
    });
  
    this.cdr.detectChanges();
  }

  onDateChange(event: any, type: string) {
    const selectedDate = event.target.value;
    if (type === 'from') {
      this.fromDate = selectedDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
  
    this.filterPosts(); 
  }

  openTriviaModal(): void {
    const today = new Date().toLocaleDateString('en-CA'); // Get today's date in YYYY-MM-DD format (Canada standard)

    const triviaExists = this.dataSource.data.some(trivia => {
      const triviaDate = new Date(trivia.created_at).toLocaleDateString('en-CA'); // Extract YYYY-MM-DD in local timezone
      return triviaDate === today;
    });

    if (triviaExists) {
      Swal.fire({
        title: "Trivia Already Posted",
        text: "You have already posted a trivia for today! You can create a new one tomorrow.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#777777",
      });
      return; // Stop execution if trivia already exists
    }

    this.dialog.open(CreatetriviaComponent, {
      data: { exampleData: 'Some data to pass' }, // Optional data to pass to the component
    });
  }
  
  openEditModal(id : number): void {
    if (this.dialog) {
    this.dialog.open(EditTriviaComponent, {
      data: { id: id }
    });
    }else {
      console.error('not found');
    }
  }

  viewTrivia(id : number): void {
    if (this.dialog) {
    this.dialog.open(ViewTriviaComponent, {
      data: { id: id }
    });
    }else {
      console.error('not found');
    }
  }

  deletequest(id: number): void {
    Swal.fire({
      title: 'Delete Trivia Question',
      text: 'Are you sure you want to delete this trivia and question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletequestion(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(question => question.id !== id);
            this.filteredDataSource.data = this.filteredDataSource.data.filter(question => question.id !== id);
  
            Swal.fire({
              title: "Trivia Question Deleted!",
              text: "The trivia and question has been successfully deleted.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the question. Please try again.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            });
            console.error(err);
          }
        });
      }
    });
  }
  

}

export interface TriviaQuestion {
  id: number;
  category: string;
  title: string;
  facts: string;
  created_at: string;
  updated_at: string;
}
