import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HeaderService } from './header.service';
import { Injectable, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService{

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  // for local
  private url:string = 'http://127.0.0.1:8000/api/';

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }

  public login(formData: FormData) {
    return this.http.post(this.url + 'login', formData).pipe(
      tap((res: any) => {
        console.log(res);
        if (res.token) {
          sessionStorage.setItem('auth-token', res.token);
          sessionStorage.setItem('name', `${res.user.fname} ${res.user.lname}`);
          sessionStorage.setItem('role', res.role); 

          let time = new Date();
          time.setMinutes(time.getMinutes() + 55);
          sessionStorage.setItem('request-token', time.toISOString());
        }
      }),
      catchError(error => {
        // Process and handle validation errors
        if (error.status === 422 && error.error) {
          const errors = error.error;
          const errorMessages = [];
          
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMessages.push(...errors[key]);
            }
          }
          
          // You can return a formatted error message or handle it as needed
          return throwError({ errors: errorMessages });
        } else {
          // Handle other types of errors
          return throwError(error);
        }
      })
    );
  }

  public register(formData: FormData): Observable<any> {
    return this.http.post(this.url + 'register', formData);
  }

  updateUser(formData: FormData): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      });

      return this.http.post(this.url + 'update', formData, { headers });
  }

  public verifyCurrentPassword(currentPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
    });
    return this.http.post(this.url + 'verify-current-password', { currentPassword }, { headers });
  }

  public changePassword(passwordData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
    });

    return this.http.post<{ message: string }>(this.url + 'change-password', passwordData, { headers })
      .pipe(
        catchError(async (error) => this.handleError(error))
      );
  }
  

}
