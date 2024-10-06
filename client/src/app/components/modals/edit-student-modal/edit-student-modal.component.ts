import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.css'
})

export class EditStudentModalComponent implements OnInit {
  @Input() selectedStudent: any;
  editStudentForm: FormGroup;
  fields: Array<{ label: string; controlName: string; type: string; isCheckbox?: boolean }> = [
    { label: 'Neptun kód', controlName: 'neptun', type: 'text' },
    { label: 'Kulcs', controlName: 'key', type: 'text' },
    { label: 'Félév', controlName: 'semester', type: 'number' },
    { label: 'Felvételi egység', controlName: 'admissionUnit', type: 'text' },
    { label: 'Elutasítva', controlName: 'previouslyDenied', type: 'checkbox', isCheckbox: true },
    { label: 'Elfogadva', controlName: 'accepted', type: 'text' },
    { label: 'Kollégiumi átlag', controlName: 'score', type: 'number' },
  ];

  constructor(
    private fb: FormBuilder
  ) {
    this.editStudentForm = this.fb.group({});
    this.fields.forEach(field => {
      this.editStudentForm.addControl(field.controlName, this.fb.control(''));
    });
  }

  ngOnInit(): void {
    if (this.selectedStudent) {
      const formData: Record<string, any> = {}; 
  
      this.fields.forEach(field => {
        if (field.controlName === 'dormitoryOrder' && Array.isArray(this.selectedStudent.dormitory_order)) {
          formData[field.controlName] = this.selectedStudent.dormitory_order.join(', ');
        } else {
          formData[field.controlName] = this.selectedStudent[field.controlName] || 'Missing data';
        }
      });
  
      this.editStudentForm.patchValue(formData);
      console.log(formData);
    }
  }

  onSubmit() {
    if (this.editStudentForm.valid) {
      const formData = this.editStudentForm.value;
      // formData.dormitoryOrder = formData.dormitoryOrder.split(',').map((item: string) => item.trim());
      console.log('Form Data:', formData);
    }
  }
}
