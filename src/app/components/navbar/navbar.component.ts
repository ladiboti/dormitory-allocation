import { Component } from '@angular/core';
import { format } from 'date-fns'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  todayDate: string;

  constructor() {
    const today = new Date();
    this.todayDate = format(today, 'yyyy.MM.dd.');
  }

}
