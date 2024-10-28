import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DormitoriesService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getDormitories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_dormitories`); 
  }

  updateDormitory(dormitoryName: string, capacity: number) {
    return this.http.post(`${this.apiUrl}/set_dormitories`, {
      dormitory_name: dormitoryName,
      capacity: capacity
    });
  }

  deleteDormitory(dormitoryName: string) {
    return this.http.delete(`${this.apiUrl}/delete_dormitory`, {
        body: { dormitory_name: dormitoryName }
    });
  }
}
