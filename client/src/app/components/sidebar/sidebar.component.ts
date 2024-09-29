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
  isAdmissionDropdownOpen: boolean = false;
  
  buttons = [
    { label: 'Dokumentumok feltöltése', route: '/upload-documents'},
    { label: 'Hallgatók szerkesztése', route: '/edit-students'},
    { label: 'Kollégiumok szerkesztése', route: '/edit-dormitories'},
    { label: 'Felvételi eljárás', route: '/admission-process'},
    { label: 'Beállítások', route: ''},
    { label: 'Kijelentkezés', route: '/login'}
  ];

  dropdownButtons = [
    { label: 'Felvételt nyert hallgatók', route: '/admission-success'},
    { label: 'Várólista', route: '/admission-waitinglist'},
    { label: 'Elutasított hallgatók', route: '/admission-rejected'},
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
    route === '/login' 
      ? this.logout() 
      : (this.isAdmissionDropdownOpen = route === '/admission-process' ? !this.isAdmissionDropdownOpen : false, this.activeButton = route, this.router.navigate([route]));
  }

  navigateDropdown(route: string) {
    this.isAdmissionDropdownOpen = false; 
    this.activeButton = route;
    this.router.navigate([route]);
  }
}
