import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-admission-process',
  templateUrl: './admission-process.component.html',
  styleUrl: './admission-process.component.css'
})
export class AdmissionProcessComponent {
  tasks = [
    { name: 'Közösségi alapon való felvétel', modalId: 'admissionByCommunityModal' },
    { name: 'Felvételi pontszámítás', modalId: 'admissionScoresModal' },
    { name: 'Felvételi egységek létrehozása', modalId: 'createAdmissionUnitsModal' },
    { name: 'Egységenként felvehető hallgatók számának rögzítése', modalId: 'setUnitCapacitiesModal' },
    { name: 'Hallgatók felvétele egységenként', modalId: 'admitStudentsByUnitsModal' },
    { name: 'Hallgatók kollégiumok közötti kiosztása', modalId: 'allocateStudentsModal' },
    { name: 'Felvételi eljárás lezárása', modalId: 'closeAdmissionProcess' }
  ];

  constructor(
    private modalService: ModalService
  ) { }

  openEditModal(modalId: string) {
    this.modalService.openModal(modalId);
    console.log(modalId);
  }
}
