import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { EditDormitoriesComponent } from './components/edit-dormitories/edit-dormitories.component';
import { DocumentUploaderComponent } from './components/upload-documents/document-uploader/document-uploader.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'upload-documents', component: DocumentUploaderComponent, canActivate: [AuthGuard] },
  { path: 'edit-students', component: EditStudentsComponent, canActivate: [AuthGuard] },
  { path: 'edit-dormitories', component: EditDormitoriesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'upload-documents', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
