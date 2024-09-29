import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit-dormitories',
  templateUrl: './edit-dormitories.component.html',
  styleUrl: './edit-dormitories.component.css'
})
export class EditDormitoriesComponent {
  dormitories = [
    { name: 'PE-KOLI-1', size: '999' },
    { name: 'PE-KOLI-2', size: '999' },
    { name: 'PE-KOLI-3', size: '999' },
    { name: 'PE-KOLI-4', size: '999' },
    { name: 'PE-KOLI-5', size: '999' },
  ];

  constructor(
    private modalService: ModalService
  ) { }

  // TODO: implement optional dormitory parameter in the future!!!
  openEditModal() {
    this.modalService.openModal('editDormitoryModal');
  }
}
