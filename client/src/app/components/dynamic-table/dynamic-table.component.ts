import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() collectionName!: string;
  @Input() title!: string;
  @Input() attributes: { key: string, header: string, editable: boolean }[] = [];
  @Input() pageSize!: number;
  
  data: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  private debounceTimeout: any;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize,
      attributes: this.attributes.map(attr => attr.key),
      searchTerm: this.searchTerm
    };
    
    this.http.get(`http://localhost:5000/db/${this.collectionName}`, { params }).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.data = response.data; 
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  onSearchTermChange(): void {
    this.currentPage = 1; 
    this.fetchData(); 
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

  editData(row: any, attributeKey: string) {
    const updatedField = { [attributeKey]: row[attributeKey] };
  
    // Ha van aktív késleltetett művelet, töröljük azt
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  
    // Új timeout beállítása 1 másodperces késleltetéssel
    this.debounceTimeout = setTimeout(() => {
      // A filter a sor első attribútumának kulcsát használja
      const filter = { [this.attributes[0].key]: row[this.attributes[0].key] };

      const payload = {
        filter: filter,  // A sor alapján
        updates: updatedField
      };

      console.log('Payload before sending:', payload);  // Logolás a hibaelhárításhoz

      this.http.post(`http://localhost:5000/db/${this.collectionName}/edit`, payload)
        .subscribe(
          response => {
            console.log('Sikeres frissítés:', response);
            this.fetchData(); // Adatok frissítése a backend frissítés után
          },
          error => console.error('Hiba a frissítés során:', error)
        );
    }, 1000); // 1 másodperces késleltetés
  }
}
