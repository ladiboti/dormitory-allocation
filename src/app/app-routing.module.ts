import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';

const routes: Routes = [
  { path: 'upload-documents', component: UploadDocumentsComponent },
  { path: 'edit-students', component: EditStudentsComponent },
  { path: '', redirectTo: '/edit-students', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
