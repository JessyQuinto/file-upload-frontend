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
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0;

  constructor(
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.fileUploadService.getAllFiles(this.pageIndex, this.pageSize).subscribe({
      next: (response: FileResponse) => {
        this.files = response.files;
        this.totalFiles = response.total;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading files', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFiles();
  }

  onFileUploaded() {
    this.loadFiles();
  }

  onFileDeleted() {
    this.loadFiles();
  }
}