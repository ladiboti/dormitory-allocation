import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-students',
  templateUrl: './edit-students.component.html',
  styleUrl: './edit-students.component.css'
})
export class EditStudentsComponent {
  tableHeaders: string[] = ['Név', 'Neptun kód', 'Szak', 'Átlag', 'Félév', 'Távolság', 'Elutasítva', ' '];
  tableData = [
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
    ['Lorem Ipsum', 'ABC123', 'Emberi erőforrások', '3.45', '5', '200 km', 'Nem', ' '],
  ];
}
