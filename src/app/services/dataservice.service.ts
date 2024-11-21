import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataserviceService {

  // for local
  private url:string = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.url + 'user', { headers });
  }

  createPost(formData: FormData): Observable<any> {
    // Retrieve the JWT token from localStorage or sessionStorage
    const token = localStorage.getItem('authToken'); // Replace with your method of getting the token
    
    // Add token to the request headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send the request with the headers
    return this.http.post('/api/post', formData, { headers });
  }


}
