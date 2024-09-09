import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { DocumentUploaderComponent } from './components/upload-documents/document-uploader/document-uploader.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'upload-documents', component: DocumentUploaderComponent, canActivate: [AuthGuard] },
  { path: 'edit-students', component: EditStudentsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
