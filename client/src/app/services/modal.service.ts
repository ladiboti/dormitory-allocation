import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private activeModalSubject = new BehaviorSubject<string | null>(null);
  activeModal$ = this.activeModalSubject.asObservable();

  private selectedObjectSubject = new BehaviorSubject<any>(null);
  selectedObject$ = this.selectedObjectSubject.asObservable();

  openModal(modalType: string, paramObject?: any) {
    this.activeModalSubject.next(modalType);
    this.selectedObjectSubject.next(paramObject || null); 
  }

  closeModal() {
    this.activeModalSubject.next(null);
    this.selectedObjectSubject.next(null);
  }
}
