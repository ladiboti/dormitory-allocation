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
    { name: 'Közösségi és szociális alapon való felvétel', modalId: 'admissionByCommunityModal', apiEndpoint: '', type: 'modal'},
    { name: 'Felvételi pontszámítás', modalId: 'admissionScoresModal', apiEndpoint: 'calculate_scores', type: 'api'},
    { name: 'Felvételi egységek létrehozása', modalId: 'editAdmissionUnitsMaxIntake', apiEndpoint: 'create_groups', type: 'api' },
    { name: 'Hallgatók felvétele', modalId: 'admitStudentsByUnitsModal', apiEndpoint: 'allocation', type: 'api' },
    { name: 'Felvett hallgatók exportálása', modalId: '', apiEndpoint: 'export_dormitory_data', type: 'excel' },
    { name: 'Várólista exportálása', modalId: '', apiEndpoint: 'export_waitlist_data', type: 'excel' },
  ];

  constructor(
    private modalService: ModalService,
    private http: HttpClient
  ) { }

  handleTask(task: any) {
    if (!task.apiEndpoint) {
      return;
    }

    const baseUrl = 'http://localhost:5000';
    const fullUrl = `${baseUrl}/${task.apiEndpoint}`;

    // Excel letöltés kezelése
    if (task.type === 'excel') {
      this.http.get(fullUrl, { responseType: 'blob' })
        .subscribe(
          (response: Blob) => {
            const filename = task.apiEndpoint.includes('waitlist') ? 
              'varolistas_hallgatok.xlsx' : 
              'felvett_hallgatok.xlsx';
            
            const blob = new Blob([response], { 
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
          },
          error => {
            console.error(`Error downloading Excel from ${fullUrl}:`, error);
          }
        );
    } 
    // Normál API hívások kezelése
    else if (task.type === 'api') {
      this.http.get(fullUrl).subscribe(
        response => {
          console.log(`Response from ${fullUrl}:`, response);
        },
        error => {
          console.error(`Error from ${fullUrl}:`, error);
        }
      );
    }
    
    // Modal megnyitása ha szükséges
    if (task.modalId) {
      this.openEditModal(task.modalId);
    }
  }

  openEditModal(modalId: string) {
    this.modalService.openModal(modalId);
    console.log(modalId);
  }
}