import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetStudentsService {

  private apiUrl = 'http://localhost:5000/get_students'

  constructor(private http: HttpClient) { }

  getStudents(): Observable<any[]> {
    const token = localStorage.getItem('token');

    //doesnt work!!!
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
