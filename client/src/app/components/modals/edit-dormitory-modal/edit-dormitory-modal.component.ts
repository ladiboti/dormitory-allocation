import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { DormitoriesService } from '../../../services/dormitories.service';
import { response } from 'express';

@Component({
  selector: 'app-edit-dormitory-modal',
  templateUrl: './edit-dormitory-modal.component.html',
  styleUrl: './edit-dormitory-modal.component.css'
})
export class EditDormitoryModalComponent {
  @Input() selectedDormitory: any;

  constructor(
    private modalService: ModalService,
    private dormitoryService: DormitoriesService
  ) {}

  updateDormitory() {
    const dormitoryName = this.selectedDormitory.name;
    const capacity = this.selectedDormitory.size;

    this.dormitoryService.updateDormitory(dormitoryName, capacity).subscribe(
      response => {
        console.log('Sikeres kollegium frissites', response);
      },
      error => {
        console.error('Hiba történt a frissítés során:', error);
      }
    );
    this.modalService.closeModal();
  }

  deleteDormitory() {
    const dormitoryName = this.selectedDormitory.name;

    this.dormitoryService.deleteDormitory(dormitoryName).subscribe(
      response => {
        console.log('Sikeres kollegium torles', response);
        window.location.reload();
      },
      error => {
        console.error('Hiba történt a frissítés során:', error);
      }
    );
    this.modalService.closeModal();
  }
}
