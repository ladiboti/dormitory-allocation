import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { Student } from '../../../interfaces/student';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.css'
})

export class EditStudentModalComponent {
  student: Student | null = null;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
    console.log(this.modalService.selectedObject$);
    // this.student = this.modalService.selectedObject$;
  }
}
