import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() collectionName!: string;
  @Input() title!: string;
  @Input() attributes: { key: string, header: string }[] = [];
  @Input() pageSize!: number;
  
  data: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    this.http.get(`http://localhost:5000/db/dummy_applications_collection`, { params }).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.data = response.data;  // Most már a backend által lapozott adatok vannak itt
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchData();
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchData();
    }
  }
}