import { Component, OnInit } from '@angular/core';
import { GetStudentsService } from '../../services/get-students.service';
import { error } from 'console';

@Component({
  selector: 'app-edit-students',
  templateUrl: './edit-students.component.html',
  styleUrl: './edit-students.component.css'
})
export class EditStudentsComponent {
  tableHeaders: string[] = ['Név', 'Neptun kód', 'Szak', 'Félév', 'Átlag', 'Távolság', ''];
  tableData: any[] = [];

  constructor(private getStudentsService: GetStudentsService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.getStudentsService.getStudents().subscribe(
      data => {
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

      const keyMapping: { [key: string]: string } = {
        'Address': 'address',
        'Admission Unit': 'admission_unit',
        'Distance': 'distance',
        'Key': 'key',
        'Neptun': 'neptun',
        'Score': 'score',
        'Semester': 'semester'
      };

      this.tableHeaders.forEach(header => {
        const key = keyMapping[header];
        if (student.hasOwnProperty(key)) {
          filteredStudent[key] = student[key];
        }
      })
      return filteredStudent;
    });
  }

}
