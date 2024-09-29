import { Component, createNgModule } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'dormitory-allocation';
  activeModal: string | null = null;
  selectedObject: any = null;

  constructor(
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.modalService.activeModal$.subscribe(modal => {
      this.activeModal = modal;
    });

    this.modalService.selectedObject$.subscribe(object => {
      this.selectedObject = object; 
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  isLoggedIn(): boolean {
    // authintercepter, stayrequest
    return this.authService.isLoggedIn();
  }
}
