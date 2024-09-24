import { Component, OnInit } from '@angular/core';
import { GetStudentsService } from '../../services/get-students.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit-students',
  templateUrl: './edit-students.component.html',
  styleUrl: './edit-students.component.css'
})
export class EditStudentsComponent {
  tableData: any[] = [];
  headerToKeyMapping: { [key: string]: string } = {
    'Név': 'name',
    'Neptun kód': 'neptun',
    'Felvételi egység': 'admission_unit',
    'Félév': 'semester',
    'Átlag': 'score',
    'Távolság': 'distance',
    '': '' 
  };

  constructor(
    private getStudentsService: GetStudentsService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) { }

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
        this.toastr.error('')
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

  openEditModal(student: any) {
    this.modalService.openModal('editStudentModal', student);
  }
}
