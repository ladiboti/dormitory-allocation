import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:5000/login'

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password });
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
  
  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('access_token', token);
    }
  }
  
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('access_token');
    }
  }
  
  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      const token = localStorage.getItem('access_token');
      return !!token; 
    }
    return false;
  }
  
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
