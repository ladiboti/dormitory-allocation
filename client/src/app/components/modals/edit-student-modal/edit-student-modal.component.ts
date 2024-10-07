import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.css'
})

export class EditStudentModalComponent implements OnInit {
  @Input() selectedStudent: any;
  editStudentForm: FormGroup;
  fields: Array<{ label: string; controlName: string; type: string; isCheckbox?: boolean }> = [
    { label: 'Neptun kód', controlName: 'Neptun kód', type: 'text' },
    { label: 'Kulcs', controlName: 'Kulcs', type: 'text' },
    { label: 'Félév', controlName: 'Félév', type: 'number' },
    { label: 'Felvételi egység', controlName: 'Felvételi egység', type: 'text' },
    { label: 'Kollégiumi átlag', controlName: 'Kollégiumi átlag', type: 'number' },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService, 
    private toastrService: ToastrService
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
    this.editStudentForm.valid
      ? (this.modalService.closeModal(), this.toastrService.success('Sikeres módosítás!'))
      : this.toastrService.error('Kérem minden mezőt töltsön ki!');
  }
}
