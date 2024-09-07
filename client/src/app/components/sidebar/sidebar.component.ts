import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  logoPath: string = `${Config.PANNON_LOGO}`;
  username: string = 'Admin';
  activeButton: string | null = null;

  
  buttons = [
    { label: 'Dokumentumok feltöltése', route: '/upload-documents'},
    { label: 'Hallgatók szerkesztése', route: '/edit-students'},
    { label: 'Kollégiumok szerkesztése', route: 'editDorms'},
    { label: 'Felvételt nyert hallgatók', route: 'showAcceptedStudents'},
    { label: 'Elutasított hallgatók', route: 'showRejectedStudents'},
    { label: 'Várólista', route: 'showWaitingList'},
    { label: 'Beállítások', route: 'showSettings'},
  ];

  constructor(private router: Router, private toastr: ToastrService) {}

  navigate(route: string) {
    this.toastr.error('test', 'test', {
      positionClass: 'toast-bottom-left',
      timeOut: 800,
    });
    this.activeButton = route;
    this.router.navigate([route]);
  }
}
