import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  private url:string = 'http://127.0.0.1:8000/api/';

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

  TotalPendingPosts(): Observable<any> {
      return this.Admin('totalPendings');
  }

  TotalDeclinedPosts(): Observable<any> {
      return this.Admin('totalDeclined');
  }

  TotalUsers(): Observable<any> {
      return this.Admin('totalusers');
  }

  getPosts(): Observable<any> {
    return this.Admin('allPost');
  }

  approvePost(id: number): Observable<any> {
    return this.Admin(`post/${id}/approve`, 'PATCH');
  }

  rejectPost(id: number): Observable<any> {
    return this.Admin(`post/${id}/decline`, 'PATCH');
  }


}
