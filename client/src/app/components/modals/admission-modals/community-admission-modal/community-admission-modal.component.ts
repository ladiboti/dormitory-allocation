import { Component } from '@angular/core';

@Component({
  selector: 'app-community-admission-modal',
  templateUrl: './community-admission-modal.component.html',
  styleUrl: './community-admission-modal.component.css'
})
export class CommunityAdmissionModalComponent {
  tableHeaders: string[] = ['Sorszám', 'Név', 'Neptun kód'];

  tableData: any[] = [
    { Sorszám: 1, Név: 'John Doe', 'Neptun kód': 'AB1234' },
    { Sorszám: 2, Név: 'Jane Smith', 'Neptun kód': 'CD5678' },
    { Sorszám: 3, Név: 'Mike Johnson', 'Neptun kód': 'EF9101' },
    { Sorszám: 4, Név: 'Emily Davis', 'Neptun kód': 'GH2345' },
    { Sorszám: 5, Név: 'Robert Brown', 'Neptun kód': 'IJ6789' },
    { Sorszám: 1, Név: 'John Doe', 'Neptun kód': 'AB1234' },
    { Sorszám: 2, Név: 'Jane Smith', 'Neptun kód': 'CD5678' },
    { Sorszám: 3, Név: 'Mike Johnson', 'Neptun kód': 'EF9101' },
    { Sorszám: 4, Név: 'Emily Davis', 'Neptun kód': 'GH2345' },
    { Sorszám: 1, Név: 'John Doe', 'Neptun kód': 'AB1234' },
    { Sorszám: 2, Név: 'Jane Smith', 'Neptun kód': 'CD5678' }
  ];
}
