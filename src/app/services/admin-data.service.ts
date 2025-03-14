import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  private Admin(endpoint: string, method: string = 'GET', body: any = null, params: any = null): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Create an options object to include headers and params
    const options = {
        headers: headers,
        params: params // Add query parameters here
    };

    switch (method.toUpperCase()) {
        case 'GET':
            return this.http.get<any>(this.url + endpoint, options);
        case 'POST':
            return this.http.post<any>(this.url + endpoint, body, options);
        case 'PUT':
            return this.http.put<any>(this.url + endpoint, body, options);
        case 'PATCH':
            return this.http.patch<any>(this.url + endpoint, body, options);
        case 'DELETE':
            return this.http.delete<any>(this.url + endpoint, options);
        default:
            throw new Error('Invalid method');
    }
  }

  // for dashboard totals
  dashboardStatistics(): Observable<any> {
    return this.Admin('dashboardStatistics');
  }

  // dashborad - materials bar chart
  getMaterialsChart(): Observable<any> {
    return this.Admin('chartMaterials');
  }

  // dashboard - most talked-about categories
  tableCategories(startDate?: string, endDate?: string): Observable<any> {
    const params: any = {};

    if (startDate) {
      params.start_date = startDate;
    }
    if (endDate) {
      params.end_date = endDate;
    }

    return this.Admin('tableCategories', 'GET', null, params);
  }

  // dashboard - most active users
  getMostActiveUsers(): Observable<any> {
    return this.Admin('most-active-users');
  }

  // dashboard - most liked posts
  getMostLikedPosts(): Observable<any> {
    return this.Admin('most-liked-posts');
  }

  // all posts tab - all posted and reported
  AllPosts(): Observable<any> {
    return this.Admin('allPost');
  }
  
  // view post by id
  getPostById(id: number): Observable<any> {
    return this.Admin(`userpost/${id}`);
  }

  // remove post + removal remarks
  deletePost(id: number, remarks: string): Observable<any> {
    return this.Admin(`removepost/${id}`, 'PUT', { remarks });
  }

  // reported posts tab
  reportedPosts(): Observable<any> {
    return this.Admin('allReportedPosts');
  }

  // users tab - list of users
  getUsers(): Observable<any> {
    return this.Admin('users');
  }

  // delete user
  deleteUser(userId: number): Observable<any> {
    return this.Admin(`delete/user?user_id=${userId}`, 'DELETE');
  }

  // dashboard - landing page photos
  uploadLandingPhotos(formData: FormData): Observable<any> {
    return this.Admin('addphotos', 'POST', formData);
  }

  editLatestPhoto(formData: FormData): Observable<any> {
    return this.Admin('editLatestPhoto', 'POST', formData);
  }

  getAllLandingPhotos(): Observable<any> {
    return this.Admin('showallphotos');
  }

  deletePhotoById(id: number): Observable<any> {
    return this.Admin(`deletephoto/${id}`, 'DELETE');
  }

  deleteAllPhotos(ids: number[]): Observable<any> {
    return this.Admin('deleteAllPhotos', 'POST', { ids });
  }

  // no authentication required, show sa landing page
  getLandingPhotos(): Observable<any> {
    return this.http.get<any>(this.url + 'showlatestphoto');
  }

  // for announcements
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

  // for barangay posts
  createBarangayPost(formData: FormData): Observable<any> {
    return this.Admin('barangay-posts', 'POST', formData);
  }

  getBarangayPosts(): Observable<any> {
    return this.Admin('barangay-posts');
  }

  getBarangayPostById(id: number): Observable<any> {
    return this.Admin(`barangay-posts/${id}`, 'GET');
  }

  updateBarangayPost(id: number, formData: FormData): Observable<any> {
    return this.Admin(`barangay-posts/${id}`, 'PUT', formData);
  }

  deleteBarangayPost(id: number): Observable<any> {
    return this.Admin(`barangay-posts/${id}`, 'DELETE');
  }

  // report tab - categories posted
  total_post():Observable<any> {
    return this.Admin('mostCategories')
  }

  // report tab - materials posted count
  materialsPosted():Observable<any> {
    return this.Admin('materialsCount')
  }

  // report tab - most active users
  topUsers(): Observable<any> {
    return this.Admin('topUsers');
  }

  // report tab - most liked posts
  topLiked(): Observable<any> {
    return this.Admin('topLiked');
  }

  // trivia quiz - for environmental admin
  createQuestions(data: any): Observable<any>{
    return this.Admin('trivia/questions', 'POST', data)
  }

  getquestions(): Observable<any> {
    return this.Admin('trivia/getquestions')
  }

  getQuestionById(id: number): Observable<any> {
    return this.Admin(`trivia/triviaByID/${id}`, 'GET');
  }

  updatequestions(id: number, updatedTriviaData: any): Observable<any> {
    return this.Admin(`trivia/questions/${id}`, 'PUT', updatedTriviaData)
  }

  deletequestion(id: number): Observable<any> {
    return this.Admin(`trivia/question/${id}`, 'DELETE')
  }

  // wala pa
  userScores(): Observable<any>{
    return this.Admin('trivia/alluser/scores')
  }
}
