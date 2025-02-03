import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  private url:string = 'http://127.0.0.1:8000/api/';
  //for development
  // private url:string = 'https://api.resit.site/api/';

  constructor(private http: HttpClient) { }

  // private Admin(endpoint: string): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get<any>(this.url + endpoint, { headers });
  // }

  private Admin(endpoint: string, method: string = 'GET', body: any = null): Observable<any> {
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

  TotalPosts(): Observable<any> {
      return this.Admin('totalPosts');
  }

  // allPosts(): Observable<any> {
  //     return this.Admin('allPost');
  // }

  allPosts(params: { start_date: string; end_date: string }): Observable<any> {
    const queryParams = new HttpParams()
      .set('start_date', params.start_date)
      .set('end_date', params.end_date);
  
    return this.Admin('allPost', 'GET', queryParams);  
  }
  
  getPostById(id: number): Observable<any> {
      return this.Admin(`userpost/${id}`);
  }

  deletePost(id: number): Observable<any> {
      return this.Admin(`deletepost/${id}`, 'DELETE');
  }

  TotalPendingPosts(): Observable<any> {
      return this.Admin('totalPendings');
  }

  TotalDeclinedPosts(): Observable<any> {
      return this.Admin('totalDeclined');
  }

  TotalUsers(): Observable<any> {
      return this.Admin('totalusers');
  }

  getUsers(): Observable<any> {
      return this.Admin('users');
  }

  deleteUser(userId: number): Observable<any> {
    return this.Admin(`delete/user?user_id=${userId}`, 'DELETE');
  }

  getPosts(): Observable<any> {
    return this.Admin('allPost');
  }

  getOldest():Observable<any> {
    return this.Admin('oldestpending')
  }

  approvePost(id: number): Observable<any> {
    return this.Admin(`post/${id}/approve`, 'PATCH');
  }

  rejectPost(id: number, remarks: string): Observable<any> {
    return this.Admin(`post/${id}/decline`, 'PATCH', { remarks });
  }

  // rejectPost(id: number, ): Observable<any> {
  //   return this.Admin(`post/${id}/decline`, 'PATCH');
  // }

  // for landing page photos
  inputPhotos(formData: FormData): Observable<any> {
    return this.Admin('addphotos', 'POST', formData);
  }

  getAllLandingPhotos(): Observable<any> {
    return this.Admin('showallphotos');
  }

  deleteAllPhotos(ids: number[]): Observable<any> {
    return this.Admin('deleteAllPhotos', 'POST', { ids });  // Use POST and send the ids in the body
  }

  uploadAnn(formData: FormData): Observable<any> {
    return this.Admin('announcements', 'POST', formData);
  }

  getAnn(params: { start_date: string; end_date: string }): Observable<any> {
    const queryParams = new HttpParams()
    .set('start_date', params.start_date)
    .set('end_date', params.end_date);

    return this.Admin('getannouncements', 'GET', queryParams);
  }

  deleteAnn(id: number): Observable<any> {
    return this.Admin(`announcements/${id}`, 'DELETE')
  }

  userTotalPost():Observable<any> {
    return this.Admin('userTotalPost')
  }

  userTotalPosts():Observable<any> {
    return this.Admin('userTotalPosts')
  }

  likedpost():Observable<any> {
    return this.Admin('likechart')
  }

  likedposttable():Observable<any> {
    return this.Admin('liketable')
  }

  createQuestions(data: any): Observable<any>{
    return this.Admin('trivia/questions', 'POST', data)
  }

  getquestions(): Observable<any> {
    return this.Admin('trivia/getquestions')
  }

  updatequestions(id: number, updatedTriviaData: any): Observable<any> {
    return this.Admin(`trivia/questions/${id}`, 'PUT', updatedTriviaData)
  }

  deletequestion(id: number): Observable<any> {
    return this.Admin(`trivia/question/${id}`, 'DELETE')
  }

  userScores(): Observable<any>{
    return this.Admin('trivia/alluser/scores')
  }

}
