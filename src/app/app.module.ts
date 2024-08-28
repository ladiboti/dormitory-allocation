import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EditStudentsComponent } from './components/edit-students/edit-students.component';
import { UploaderCardComponent } from './components/upload-documents/uploader-card/uploader-card.component';
import { DocumentUploaderComponent } from './components/upload-documents/document-uploader/document-uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    EditStudentsComponent,
    UploaderCardComponent,
    DocumentUploaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
