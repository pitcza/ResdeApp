import { Component, Input, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-trivia-scores',
  templateUrl: './trivia-scores.component.html',
  styleUrls: ['./trivia-scores.component.scss']
})
export class TriviaScoresComponent implements OnInit {
  @Input() scores: TriviaScore[] = [];

  displayedColumns: string[] = ['username', 'score', 'Phone Number', 'Street'];
  dataSource: TriviaScore[] = [];
  uniqueUsers: string[] = [];

  constructor(private as: AdminDataService) {}

  ngOnInit() {
    // this.fetchUserScore();
    this.fetchUsersAndScores();
  }

  fetchUsersAndScores(): void {
    this.as.getUsers().subscribe(
      (userResponse) => {
        const users = userResponse
          .filter((user: any) => {
            const fnameLower = user.fname.toLowerCase().trim();  
            return fnameLower !== 'user' && fnameLower !== 'agriculural';
          })
          .map((user: any) => ({
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone: user.phone_number,  
            badge: user.badge,
            created_at: user.created_at
          }));
  
        this.as.userScores().subscribe(
          (scoreResponse) => {
            this.scores = scoreResponse?.users?.map((score: any) => {
              const user = users.find((u: { id: any; }) => u.id === score.user_id);
              return {
                user_name: user ? `${user.fname} ${user.lname}` : 'Unknown',
                triviaId: score.user_id, 
                question: 'N/A',  
                correct: score.total_score,
                phone: user?.phone || 'N/A',  
                email: user?.email || 'N/A', 
                created_at: user?.created_at || 'N/A',  
              };
            }) || [];
  
            this.scores.sort((a, b) => b.correct - a.correct);
  
            this.dataSource = this.scores;
            this.uniqueUsers = [...new Set(this.scores.map(score => score.user_name))]; 
          },
          (error) => {
            console.error('Error fetching scores:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  

  // fetchUserScore() {
  //   this.as.userScores().subscribe(
  //     (response) => {
  //       this.scores = response?.users?.map((user: any) => ({
  //         user_name: user.user_name,
  //         triviaId: user.user_id, 
  //         question: 'N/A', 
  //         correct: user.total_score
  //       })) || [];

  //       this.dataSource = this.scores;
  //       this.uniqueUsers = [...new Set(this.scores.map(score => score.user_name))]; 
  //     },
  //     (error) => {
  //       console.error('Error fetching scores:', error);
  //     }
  //   );
  // }
}

export interface TriviaScore {
  user_name: string;
  triviaId: number | string;
  question: string;
  correct: number
}
