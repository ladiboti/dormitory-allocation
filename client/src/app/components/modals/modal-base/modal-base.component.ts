import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css'
})
export class ModalBaseComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    console.log("megy")
    this.close.emit(); 
  }
}
