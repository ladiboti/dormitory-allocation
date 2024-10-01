import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-admission-process',
  templateUrl: './admission-process.component.html',
  styleUrl: './admission-process.component.css'
})
export class AdmissionProcessComponent {
  tasks = [
    { name: 'Közösségi alapon való felvétel', modalId: 'admissionByCommunity' },
    { name: 'Felvételi pontszámítás', modalId: 'admissionScoring' },
    { name: 'Felvételi egységek létrehozása', modalId: 'createAdmissionUnits' },
    { name: 'Egységenként felvehető hallgatók számának rögzítése', modalId: 'setUnitCapacities' },
    { name: 'Hallgatók felvétele egységenként', modalId: 'admitStudentsByUnits' },
    { name: 'Hallgatók kollégiumok közötti kiosztása', modalId: 'allocateStudents' },
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
