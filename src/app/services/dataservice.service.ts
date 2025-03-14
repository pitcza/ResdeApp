import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataserviceService {

  // for local
  private url:string = 'http://127.0.0.1:8000/api/';
  //for development
  // private url:string = 'https://api.resit.site/api/';

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

  // getUserLikes(id: number): Observable<any> {
  //   return this.User(`/posts/${id}/total-likes`)
  // }

  // user posting
  createPost(formData: FormData): Observable<any> {
    return this.User('post', 'POST', formData)
  }

  updatePost(id: number, data: any): Observable<any> {
    return this.User(`updatepost/${id}`, 'POST', data);
  }

  deletePost(id: number): Observable<any> {
    return this.User(`userdeletepost/${id}`, 'DELETE');
  }

  // community feed - all users posts
  getAllPosts(): Observable<any> {
    return this.User('all-posts');
  }

  // logged in user posts
  getUserPosts(): Observable<any> {
    return this.User('getUserPosts')
  }

  // view post - sira pa
  getPost(postId: number): Observable<any> {
    return this.User(`post/${postId}`, 'GET');
  }

  // for liking posts
  toggleLike(postId: number): Observable<any> {
    return this.User(`posts/${postId}/toggle-like`, 'POST');
  }

  // liked posts
  getLikedPosts(): Observable<any> {
    return this.User('liked-posts');
  }

  // for reporting posts
  reportPost(postId: number, body: any): Observable<any> {
    return this.User(`posts/${postId}/report`, 'POST', body);
  }

  // community feed - show barangay announcements
  getannouncement(): Observable<any> {
    return this.User(`getannouncements`, 'GET'); 
  }
  
  // for trivia
  getTodayTrivia(): Observable<any> {
    return this.User('trivia/triviatoday')
  }

  getQuestions(): Observable<any> {
    return this.User(`trivia/getquestions`); 
  }

  getUserScore(): Observable<any> {
    return this.User(`trivia/user/score`); 
  }

  submitAnswer(id: number, answer: string): Observable<any> {
    return this.User(`trivia/questions/${id}/answer`, 'POST', { answer: answer }); 
  }

  // barangay posts
  getBarangayPosts(): Observable<any> {
    return this.User('barangay-posts');
  }

  getBarangayPostById(id: number): Observable<any> {
    return this.User(`barangay-posts/${id}`, 'GET');
  }
}
