import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessages: string[] = [];
  isLoading = false;
  passwordVisible = false;

  // method to toggle the password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private as: AuthserviceService,
    private userData: DataserviceService,
  ) {}

  ngOnInit() {  
    // Retrieve email and password from query parameters if available
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginData.email = params['email'];
      }
      if (params['password']) {
        this.loginData.password = params['password'];

        const swalLoading = Swal.fire({
          title: 'Password Reset Successful!',
          text: 'Logging in with your new password...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        // Wait for delay before calling onLogin
        setTimeout(() => {
          Swal.close();  // Close loading after delay
          this.onLogin();  // Call onLogin after the delay
        }, 1500);
      }
    });
  }
  

  onLogin() {
    this.isLoading = true;

    // Check if email or password is blank
    if (!this.loginData.email || !this.loginData.password) {
      this.isLoading = false;
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Enter your email and password!',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
      });
      return; // Exit the function
    }

    const formData = new FormData();
    formData.append('email', this.loginData.email);
    formData.append('password', this.loginData.password);

    this.as.login(formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        
        // ✅ Store authToken and userId
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.user.id); // Store user ID

        switch (response.role) {
          case 'admin':
            this.router.navigate(['/admin']).then(() => {
              this.showSuccessAlert();
            });
            break;
          case 'agri':
            this.router.navigate(['/agri-admin']).then(() => {
              this.showSuccessAlert();
            });
            break;
          default:
            this.router.navigate(['/main']).then(() => {
              this.showSuccessAlert();
              this.showTriviaPopup();
            });
            break;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        
        let title = 'Login Failed';
        let icon = 'error';

        if (error.status === 401) {
          title = 'Invalid Credentials';
          icon = 'warning';
        } else {
          title = 'An Error Occurred';
        }

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          iconColor: '#FF6B6B',
          title: title,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    );
}


  showSuccessAlert() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      iconColor: '#689f7a',
      title: 'Login Successfully',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
  }

  showTriviaPopup() {
    console.log("Starting showTriviaPopup...");
  
    Swal.fire({
      title: 'Fetching Today’s Trivia! 🌿',
      text: 'Hold on! We’re bringing you an eco-friendly fact to challenge your knowledge.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.userData.getTodayTrivia().subscribe(
      (trivia) => {
        console.log("Trivia fetched:", trivia);
        Swal.close(); // Close loading popup
  
        this.userData.getUserScore().subscribe(
          (userScores) => {
            console.log("User scores fetched:", userScores);
  
            const hasAnswered = userScores.some((q: any) => q.trivia_question_id === trivia.id);
            console.log("Checking if user has already answered:", hasAnswered);
  
            if (!hasAnswered) {
              console.log("User has NOT answered, showing trivia popup...");
  
              Swal.fire({
                title: `${trivia.category} Trivia of the Day 🌱`,
                html: `<strong>${trivia.title}</strong><br><br>${trivia.facts}`,
                icon: 'info',
                confirmButtonText: 'Got it!',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                console.log("User clicked 'Next', showing trivia question...");
  
                Swal.fire({
                  title: 'Getting Your Question Ready... 🤔',
                  text: 'Just a moment! Your challenge is loading.',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  }
                });
  
                setTimeout(() => {
                  Swal.close(); // Close loading popup
  
                  // Show trivia question
                  Swal.fire({
                    title: '🌍 Trivia Question!',
                    text: trivia.question,
                    input: 'radio',
                    inputOptions: trivia.answers.reduce((options: any, answer: string, index: number) => {
                      options[index] = answer;
                      return options;
                    }, {}),
                    inputValidator: (value) => {
                      console.log("Validating input:", value);
                      return value ? null : 'Please select an answer!';
                    },
                    confirmButtonText: 'Submit Answer',
                    confirmButtonColor: '#3085d6'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const selectedAnswer = trivia.answers[result.value];
                      console.log("Submitting answer:", selectedAnswer);
  
                      Swal.fire({
                        title: 'Checking Your Answer... 🔍',
                        text: 'Let’s see if you got it right!',
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                      });
  
                      // Submit the answer
                      this.userData.submitAnswer(trivia.id, selectedAnswer).subscribe(
                        (response) => {
                          console.log("Answer submitted successfully:", response);
                          Swal.close(); // Close loading popup
  
                          const isCorrect = response.correct;
                          Swal.fire({
                            title: isCorrect ? '🎉 You Got It Right!' : '❌ Oops, Not Quite!',
                            text: `The correct answer is: ${trivia.correct_answer}`,
                            icon: isCorrect ? 'success' : 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6'
                          });
                        },
                        (error) => {
                          console.error("Error submitting answer:", error);
                          Swal.close(); // Close loading popup
                          Swal.fire({
                            title: 'Error',
                            text: 'Something went wrong. Please try again later.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                          });
                        }
                      );
                    }
                  });
                }, 1000); // Simulated delay for question loading
              });
            } else {
              console.log("User has already answered, skipping trivia popup.");
            }
          },
          (error) => {
            console.error("Error fetching user score:", error);
            Swal.close();
          }
        );
      },
      (error) => {
        console.error("Error fetching trivia:", error);
        Swal.close();
      }
    );
  }
  
  
 
}
