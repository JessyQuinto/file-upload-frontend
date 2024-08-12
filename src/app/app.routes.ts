import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FileManagementComponent } from './file-management/file-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'file-management', component: FileManagementComponent },
  { path: '**', redirectTo: '' }
];