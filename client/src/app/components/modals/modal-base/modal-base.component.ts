import { Component, Input} from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css'
})
export class ModalBaseComponent {
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';

  constructor(private modalService: ModalService) { }

  closeModal() {
    this.modalService.closeModal(); 
  }

  get isVisible(): boolean {
    return this.modalService.activeModal$ !== null; 
  }
}
