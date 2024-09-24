import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private activeModalSubject = new BehaviorSubject<string | null>(null);
  activeModal$ = this.activeModalSubject.asObservable();
  selectedStudent : any = null;

  openModal(modalType: string, student?: any) {
    this.activeModalSubject.next(modalType);
    if (student) {
      this.selectedStudent = student;
    }
  }

  closeModal() {
    this.activeModalSubject.next(null);
    this.selectedStudent = null;
  }
}
