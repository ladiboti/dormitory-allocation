import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.css'
})

export class EditStudentModalComponent implements OnInit {
  @Input() selectedStudent: any;
  editStudentForm: FormGroup;
  fields: Array<{ label: string; controlName: string; dbKey: string; type: string; isCheckbox?: boolean }> = [
    { label: 'Neptun kód', controlName: 'Neptun kód', dbKey: 'neptun', type: 'text' },
    { label: 'Kulcs', controlName: 'Kulcs', dbKey: 'key', type: 'text' },
    { label: 'Felvételi egység', controlName: 'Felvételi egység', dbKey: 'admission_unit', type: 'text' },
    { label: 'Félév', controlName: 'Félév', dbKey: 'semester', type: 'number' },
    { label: 'Kollégiumi átlag', controlName: 'Kollégiumi átlag', dbKey: 'dormitory_average', type: 'number' },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService, 
    private toastrService: ToastrService,
    private http: HttpClient
  ) {
    this.editStudentForm = this.fb.group({});
    this.fields.forEach(field => {
      this.editStudentForm.addControl(field.controlName, this.fb.control('', Validators.required));
    });
  }

  ngOnInit(): void {
    console.log('Selected Student:', this.selectedStudent); 
    if (this.selectedStudent) {
      const formData: Record<string, any> = {}; 
  
      this.fields.forEach(field => {
        if (field.controlName in this.selectedStudent) {
          formData[field.controlName] = this.selectedStudent[field.controlName] || 'Missing data';
        } else {
          formData[field.controlName] = 'Missing data'; 
        }
      });
  
      this.editStudentForm.patchValue(formData);
      console.log('Form Data:', formData); 
    }
  }

  onSubmit() {
    const formData = this.editStudentForm.value;
    const key = formData['Kulcs'];

    const dbFormData: Record<string, any> = {};
    this.fields.forEach(field => {
        if (formData[field.controlName] !== undefined) {
            dbFormData[field.dbKey] = formData[field.controlName];
        }
    });

    console.log("dbFormData to submit:", dbFormData);

    this.editStudentForm.valid
      ? localStorage.getItem('access_token')
        ? this.http.put(`http://localhost:5000/update_students/${key}`, dbFormData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        }).subscribe(
            (response) => {
                this.modalService.closeModal();
                this.toastrService.success('Sikeres módosítás!');

                // TODO: reload the datatable only, call loadStudents() somehow
                window.location.reload()
            },
            (error) => {
                console.error('Hiba:', error);
                this.toastrService.error('Hiba történt a módosítás során!');
            }
        )
      : this.toastrService.error('Hiba: Az access token nem található!')
      : this.toastrService.error('Kérem minden mezőt töltsön ki!');
}
}
