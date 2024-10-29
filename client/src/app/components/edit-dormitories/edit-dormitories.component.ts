import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { DormitoriesService } from '../../services/dormitories.service';

@Component({
  selector: 'app-edit-dormitories',
  templateUrl: './edit-dormitories.component.html',
  styleUrl: './edit-dormitories.component.css'
})
export class EditDormitoriesComponent {
  dormitories: any = [];

  constructor(
    private modalService: ModalService,
    private dormitoryService: DormitoriesService
  ) { }

  ngOnInit() {
    this.fetchDormitories(); 
  }

  fetchDormitories() {
    this.dormitoryService.getDormitories().subscribe({
      next: (data: any[]) => {
        this.dormitories = data.map(doc => ({
          name: doc.dormitory_name,
          size: doc.capacity
        }));
      },
      error: (error) => {
        console.error('Error fetching dormitories', error);
      }
    });
  }

  openEditModal(dormitory: any) {
    this.modalService.openModal('editDormitoryModal', dormitory);
  }

  openAddModal() {
    this.modalService.openModal('addDormitoryModal');
  }
}
