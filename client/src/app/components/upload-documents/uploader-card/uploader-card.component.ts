import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-uploader-card',
  templateUrl: './uploader-card.component.html',
  styleUrls: ['./uploader-card.component.css']
})
export class UploaderCardComponent {
  file: File | null = null;
  fileUploaded: boolean = false;
  dragging: boolean = false;
  
  @Input() title?: string;
  @Input() documentType?: string;  
  constructor(private sNotify: ToastrService, private http: HttpClient) {}

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.isExcelFile(file)
        ? this.setFile(file)
        : this.sNotify.error('Csak Excel fájlokat lehet feltölteni!');
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  isExcelFile(file: File): boolean {
    return file.type === 'application/vnd.ms-excel' 
      || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  
  setFile(file: File) {
    this.file = file;
    this.fileUploaded = true;
    this.sNotify.success('Fájl sikeresen kiválasztva!');
  }

  handleUpload() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('documentType', this.documentType ?? ''); 

      this.uploadToServer(formData).subscribe(
        () => {
          this.sNotify.success('Fájl sikeresen feltöltve!');
          this.fileUploaded = false; 
        },
        (error) => {
          this.sNotify.error('Hiba a fájl feltöltése során: ' + error.message);
          console.error('Hiba:', error);
        }
      );
    } else {
      this.sNotify.error('Nem választott ki fájlt.');
    }
  }

  uploadToServer(formData: FormData): Observable<any> {
    const uploadUrl = 'http://localhost:5000/upload_documents'; 
    return this.http.post(uploadUrl, formData);
  }
}