import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { Student } from '../../../interfaces/student';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.css'
})

export class EditStudentModalComponent {
  @Input() selectedStudent: any;
}
