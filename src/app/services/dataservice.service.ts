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

  private User(endpoint: string, method: string = 'GET', body: any = null): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    switch (method.toUpperCase()) {
      case 'GET':
          return this.http.get<any>(this.url + endpoint, { headers });
      case 'POST':
          return this.http.post<any>(this.url + endpoint, body, { headers });
      case 'PUT':
          return this.http.put<any>(this.url + endpoint, body, { headers });
      case 'PATCH':
          return this.http.patch<any>(this.url + endpoint, body, { headers });
      case 'DELETE':
          return this.http.delete<any>(this.url + endpoint, { headers });
      default:
          throw new Error('Invalid method');
  }
}

  getUser(): Observable<any> {
    return this.User('user')
  }

  createPost(formData: FormData): Observable<any> {
    return this.User('post', 'POST', formData)
  }

  getUserPosts(): Observable<any> {
    return this.User('getUserPosts')
  }

  deletePost(id: number): Observable<any> {
    return this.User(`deletepost/${id}`, 'DELETE');
  }

  getPost(id: number): Observable<any> {
    return this.User(`post/${id}`);
  }

  update(id: number): Observable<any> {
    return this.User(`updatepost/${id}`);
  }

  

  

  // getUser(): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get<any>(this.url + 'user', { headers });
  // }

  // createPost(formData: FormData): Observable<any> {
  //   // Retrieve the JWT token from localStorage or sessionStorage
  //   const token = localStorage.getItem('authToken'); // Replace with your method of getting the token
   
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.post('/api/post', formData, { headers });
  // }


}
