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
    //for development
  // private url:string = 'https://api.resit.site/api/';

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
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

  public logout(): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
  
    if (!token) {
      return throwError({ error: 'User not authenticated' });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(this.url + 'logout', {}, { headers }).pipe(
      tap(() => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('request-token');
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return throwError(error);
      })
    );
  }
  

  public register(formData: FormData): Observable<any> {
    return this.http.post(this.url + 'register', formData).pipe(
      tap((res: any) => {
        if (res.success) {
          // Once registration is successful, trigger email verification
          this.triggerEmailVerification(formData.get('email') as string);
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private triggerEmailVerification(email: string) {
    // Send the email address to the backend for verification
    this.http.post(`${this.url}verify-email-with-code`, { email }).subscribe(
      (response) => {
        console.log('Verification email sent successfully:', response);
        // Optionally, you can handle the response and inform the user
      },
      (error) => {
        console.error('Error sending verification email:', error);
        // Optionally, handle the error, e.g., show an alert to the user
      }
    );
  }

  public verifyEmailWithCode(email: string, verificationCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}` // You can change this based on where you're storing the token
    });
  
    const payload = { email, verification_code: verificationCode };
  
    return this.http.post<any>(this.url + 'verify-email-with-code', payload, { headers }).pipe(
      tap((res) => {
        console.log('Email verified successfully:', res);
      }),
      catchError(error => {
        if (error.status === 400 && error.error) {
          return throwError({ message: 'Invalid or expired verification code.' });
        }
        return throwError(error);
      })
    );
  }

  resendVerificationEmail(email: string) {
    return this.http.post(`${this.url}email/resend`, { email });
  }

  public cancelRegistration(email: string): Observable<any> {
    // Create the headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    // Send a DELETE request to the API to cancel the registration
    return this.http.delete(this.url + 'cancel-registration', {
      headers: headers,
      body: { email }
    }).pipe(
      tap((res: any) => {
        console.log('Registration canceled successfully:', res);
      }),
      catchError((error) => {
        console.error('Error canceling registration:', error);
        return throwError(error);
      })
    );
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.url}forgot-password`, { email }).pipe(
      tap((response: any) => {
        console.log('Password reset email sent:', response);
        // Handle the response, such as displaying a success message
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error response
        console.error('Error during password reset:', error);
        return throwError(error);
      })
    );
  }

  public verifyResetToken(email: string, token: string): Observable<any> {
    return this.http.post(`${this.url}verify-token`, { email, token }).pipe(
      tap((response: any) => {
        console.log('Token verified successfully:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle token verification errors
        console.error('Error verifying token:', error);
        return throwError(error);
      })
    );
  }

  // without auto login
  public resetPassword(email: string, token: string, passwordData: any): Observable<any> {
    // Verify the token before proceeding
    return this.verifyResetToken(email, token).pipe(
      tap(() => {
        // If token is valid, proceed to reset password
        this.http.post(`${this.url}reset-password`, { email, token, ...passwordData }).pipe(
          tap((response: any) => {
            console.log('Password has been reset successfully:', response);
          }),
          catchError(this.handleError)
        ).subscribe();
      }),
      catchError(this.handleError)
    );
  }

  // with auto login sa back, ayaw makuha pwede naman pala sa ts lang
  // resetPasswordAndLogin(email: string, password: string, token: string): Observable<any> {
  //   const payload = {
  //     email: email,
  //     password: password,
  //     password_confirmation: password,
  //     token: token
  //   };
  
  //   return this.http.post(`${this.url}reset-password`, payload).pipe(
  //     tap((res: any) => {
  //       console.log('Password reset and login successful:', res);
  
  //       if (res.token) {
  //         sessionStorage.setItem('auth-token', res.token);
  //         sessionStorage.setItem('name', `${res.user.fname} ${res.user.lname}`);
  //         sessionStorage.setItem('role', res.role);
  
  //         let time = new Date();
  //         time.setMinutes(time.getMinutes() + 55);  // Set expiration time for the token
  //         sessionStorage.setItem('request-token', time.toISOString());
  //       }
  //     }),
  //     catchError(error => {
  //       if (error.status === 400) {
  //         return throwError({ message: 'Invalid or expired reset token.' });
  //       } else if (error.status === 422 && error.error) {
  //         const errors = error.error;
  //         const errorMessages = [];
  //         for (const key in errors) {
  //           if (errors.hasOwnProperty(key)) {
  //             errorMessages.push(...errors[key]);
  //           }
  //         }
  //         return throwError({ errors: errorMessages });
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }
  
  public getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
    });
  
    return this.http.get(this.url + 'getUser', { headers }).pipe(
      tap((res: any) => {
        console.log('User data fetched successfully:', res);
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );
  }
  
  updateUser(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
    });
  
    return this.http.put(this.url + 'update', formData, { headers });
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
