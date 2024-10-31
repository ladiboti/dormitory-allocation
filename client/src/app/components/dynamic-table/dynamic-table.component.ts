import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent {
  @Input() collectionName!: string;  
  @Input() attributes!: string[];     
  
  data: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get(`http://localhost:5000/db/${this.collectionName}`).subscribe(
      (response: any) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data', error)
      }
    )
  }
}
