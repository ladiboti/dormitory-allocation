import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-uploader-card',
  templateUrl: './uploader-card.component.html',
  styleUrl: './uploader-card.component.css'
})
export class UploaderCardComponent {
  @Input() title?: string;
}
