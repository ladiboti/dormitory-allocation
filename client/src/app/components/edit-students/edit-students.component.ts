import { Component, OnInit } from '@angular/core';
import { GetStudentsService } from '../../services/get-students.service';
import { error } from 'console';

@Component({
  selector: 'app-edit-students',
  templateUrl: './edit-students.component.html',
  styleUrl: './edit-students.component.css'
})
export class EditStudentsComponent {
  tableData: any[] = [];
  headerToKeyMapping: { [key: string]: string } = {
    'Név': 'address',
    'Neptun kód': 'neptun',
    'Felvételi egység': 'admission_unit',
    'Félév': 'semester',
    'Átlag': 'score',
    'Távolság': 'distance',
    '': '' 
  };

  constructor(private getStudentsService: GetStudentsService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.getStudentsService.getStudents().subscribe(
      data => {
        console.log('Raw data from service:', data);  
        this.tableData = this.filterTableData(data);
        console.log(this.tableData);
      },
      error => {
        console.error('Error fetching students');
      }
    );
  }

  filterTableData(data: any[]): any[] {
    return data.map(student => {
      const filteredStudent: any = {};
      for (const [header, key] of Object.entries(this.headerToKeyMapping)) {
        filteredStudent[header] = student[key] || 'Missing data'; 
      }
      return filteredStudent;
    });
  }

  get tableHeaders(): string[] {
    return Object.keys(this.headerToKeyMapping);
  }
}
