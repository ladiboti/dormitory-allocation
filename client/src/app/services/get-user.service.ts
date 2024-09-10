import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

  private apiUrl = 'http://localhost:5000/user'

  constructor(private http: HttpClient) { }

  getUsername(): Observable<{ username: string }> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ username: string }>(this.apiUrl, { headers });
  }
}
