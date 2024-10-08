import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { FileListComponent } from '../file-list/file-list.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FileUploadService } from '../services/file-upload.service';
import { FileItem, FileResponse } from '../components/file-upload/file-upload.model';

@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FileUploadComponent,
    FileListComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagementComponent implements OnInit {
  files: FileItem[] = [];
  totalFiles: number = 0;
  pageSize: number = 12; // Aumentado para mostrar más archivos por página
  pageSizeOptions: number[] = [12, 24, 48, 96]; // Ajustado para coincidir con el nuevo pageSize
  pageIndex: number = 0;

  constructor(
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    console.log('Loading files in FileManagementComponent. Page:', this.pageIndex, 'PageSize:', this.pageSize);
    this.fileUploadService.getAllFiles(this.pageIndex, this.pageSize).subscribe({
      next: (response: FileResponse) => {
        console.log('Files loaded in FileManagementComponent:', response);
        this.files = response.items;
        this.totalFiles = response.totalItems;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading files in FileManagementComponent', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page changed in FileManagementComponent:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFiles();
  }

  onFileUploaded() {
    console.log('File uploaded, reloading files in FileManagementComponent');
    this.pageIndex = 0; // Reset to first page after upload
    this.loadFiles();
  }

  onFileDeleted() {
    console.log('File deleted, reloading files in FileManagementComponent');
    this.loadFiles();
  }
}