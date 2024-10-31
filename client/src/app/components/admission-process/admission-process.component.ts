import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admission-process',
  templateUrl: './admission-process.component.html',
  styleUrl: './admission-process.component.css'
})
export class AdmissionProcessComponent {
  tasks = [
    { name: 'Közösségi alapon való felvétel', modalId: 'admissionByCommunityModal', apiEndpoint: ''},
    { name: 'Felvételi pontszámítás', modalId: 'admissionScoresModal', apiEndpoint: 'calculate_scores'},
    { name: 'Felvételi egységek létrehozása', modalId: 'createAdmissionUnitsModal', apiEndpoint: 'create_groups' },
    { name: 'Egységenként felvehető hallgatók számának rögzítése', modalId: 'setUnitCapacitiesModal' },
    { name: 'Hallgatók felvétele egységenként', modalId: 'admitStudentsByUnitsModal', apiEndpoint: 'allocation' },
    { name: 'Hallgatók kollégiumok közötti kiosztása', modalId: 'allocateStudentsModal', apiEndpoint: 'allocation' },
    { name: 'Felvételi eljárás lezárása', modalId: '' }
  ];

  constructor(
    private modalService: ModalService,
    private http: HttpClient
  ) { }

  handleTask(task: any) {
    const baseUrl = 'http://localhost:5000'; // Define the base URL
    const fullUrl = `${baseUrl}/${task.apiEndpoint}`; // Concatenate base URL with API endpoint
  
    this.http.get(fullUrl).subscribe(
      response => {
        console.log(`Response from ${fullUrl}:`, response);
      },
      error => {
        console.error(`Error from ${fullUrl}:`, error);
      }
    );
  }

  // might need to be called from handleTask()
  openEditModal(modalId: string) {
    this.modalService.openModal(modalId);
    console.log(modalId);
  }
}
