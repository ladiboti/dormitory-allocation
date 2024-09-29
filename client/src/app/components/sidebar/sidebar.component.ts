import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../config';
import { ToastrService } from 'ngx-toastr';
import { GetUserService } from '../../services/get-user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  logoPath: string = `${Config.PANNON_LOGO}`;
  username: string = '';
  activeButton: string | null = null;
  
  buttons = [
    { label: 'Dokumentumok feltöltése', route: '/upload-documents'},
    { label: 'Hallgatók szerkesztése', route: '/edit-students'},
    { label: 'Kollégiumok szerkesztése', route: '/edit-dormitories'},
    { label: 'Felvételt nyert hallgatók', route: 'showAcceptedStudents'},
    { label: 'Elutasított hallgatók', route: 'showRejectedStudents'},
    { label: 'Várólista', route: 'showWaitingList'},
    { label: 'Beállítások', route: 'showSettings'},
    { label: 'Kijelentkezés', route: '/login'}
  ];

  constructor(
    private router: Router, 
    private toastr: ToastrService, 
    private getUserService: GetUserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUserService.getUsername().subscribe(
      user => this.username = user.username,
      error => {
        this.username = 'Missing username';
        console.error('Failed to load user', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  navigate(route: string) {
    route === '/login' ? this.logout() : (this.activeButton = route, this.router.navigate([route]));
  }
}
