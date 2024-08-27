import { Component } from '@angular/core';
import { Config } from '../../config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  logoPath: string = `${Config.PANNON_LOGO}`;
  username: string = 'Botikasz';
  activeButton: string | null = null;
  
  buttons = [
    { label: 'Dokumentumok feltöltése', action: 'uploadDocuments'},
    { label: 'Hallgatók szerkesztése', action: 'editStudents'},
    { label: 'Kollégiumok szerkesztése', action: 'editDorms'},
    { label: 'Felvételt nyert hallgatók', action: 'showAcceptedStudents'},
    { label: 'Elutasított hallgatók', action: 'showRejectedStudents'},
    { label: 'Várólista', action: 'showWaitingList'},
    { label: 'Beállítások', action: 'showSettings'},
  ];


  onButtonClick(action: string) {
    console.log('Button clicked: ${action}');
    this.activeButton = action;
  }
}
