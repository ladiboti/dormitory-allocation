import { Component } from '@angular/core';
import { DormitoriesService } from '../../../services/dormitories.service';

@Component({
  selector: 'app-add-dormitory-modal',
  templateUrl: './add-dormitory-modal.component.html',
  styleUrl: './add-dormitory-modal.component.css'
})
export class AddDormitoryModalComponent {
  dormitoryData = {
    name: '',
    capacity: 0
  };

  constructor(
    private dormitoryService: DormitoriesService
  ) {}

  addDormitory() {
    this.dormitoryService.updateDormitory(this.dormitoryData.name, this.dormitoryData.capacity).subscribe(
      response => {
        console.log('Sikeres kollegium hozzaadas', response);
        window.location.reload();
      },
      error => {
        console.error('Hiba történt a hozzáadás során:', error);
      }
    );
  }
}
