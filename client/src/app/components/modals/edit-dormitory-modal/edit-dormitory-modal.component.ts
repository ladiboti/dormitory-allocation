import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-edit-dormitory-modal',
  templateUrl: './edit-dormitory-modal.component.html',
  styleUrl: './edit-dormitory-modal.component.css'
})
export class EditDormitoryModalComponent {
  @Input() selectedDormitory: any;
}
