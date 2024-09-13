import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../main/components/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private userData: any = null;

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  // for local
  private url:string = 'http://127.0.0.1:8000/api/';

  public login(formData: FormData) {
    return this.http.post(this.url + 'login', formData).pipe(
      tap((res: any) => {
        if (res.token) {
          sessionStorage.setItem('auth-token', res.token);
          sessionStorage.setItem('name', res.displayName);
          sessionStorage.setItem('role', res.position);

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

  // Example of storing user data after login
  saveUserData(data: any) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }


  getUserData(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
}
