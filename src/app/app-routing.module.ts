import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { DocumentUploaderComponent } from './components/upload-documents/document-uploader/document-uploader.component';

const routes: Routes = [
  { path: 'upload-documents', component: DocumentUploaderComponent },
  { path: 'edit-students', component: EditStudentsComponent },
  { path: '', redirectTo: '/upload-documents', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
