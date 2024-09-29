import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { UploaderCardComponent } from './components/upload-documents/uploader-card/uploader-card.component';
import { DocumentUploaderComponent } from './components/upload-documents/document-uploader/document-uploader.component';
import { LoginComponent } from './components/login/login.component';
import { ModalBaseComponent } from './components/modals/modal-base/modal-base.component';
import { EditStudentModalComponent } from './components/modals/edit-student-modal/edit-student-modal.component';
import { EditDormitoriesComponent } from './components/edit-dormitories/edit-dormitories.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    EditStudentsComponent,
    UploaderCardComponent,
    DocumentUploaderComponent,
    LoginComponent,
    ModalBaseComponent,
    EditStudentModalComponent,
    EditDormitoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
