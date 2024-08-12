import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: '**', redirectTo: '' }
];