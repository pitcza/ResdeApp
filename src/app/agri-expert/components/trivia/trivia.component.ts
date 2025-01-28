import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../services/admin-data.service';
import { CreatetriviaComponent } from '../createtrivia/createtrivia.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTriviaComponent } from '../edit-trivia/edit-trivia.component';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  displayedColumns: string[] = ['date', 'question', 'answers', 'correct_answer', 'action'];
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
        this.dataSource = new MatTableDataSource(data);
        this.filteredDataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  filterPosts() {
  
    this.filteredDataSource.data = this.dataSource.data.filter(post => {
  
      // Date filter logic
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

  deletequest(id: number): void {
    Swal.fire({
      title: 'Delete Trivia Question',
      text: 'Are you sure you want to delete this question?',
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
              title: "Question Deleted!",
              text: "The question has been successfully deleted.",
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
  question: string;
  correct_answer: string;
  answers: string[];
  created_at: string;
  updated_at: string;
}
