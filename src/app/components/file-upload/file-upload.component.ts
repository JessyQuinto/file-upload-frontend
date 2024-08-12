import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { FileUploadService} from '../../services/file-upload.service';
import { NotificationService } from '../../services/notification.service';
import { FileUploadStateService } from '../../services/file-upload-state.service';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { FileListComponent } from '../../file-list/file-list.component';
import { FileItem, FileResponse } from './file-upload.model';
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatButtonModule, HeaderComponent, FooterComponent, FileListComponent],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  files: FileItem[] = [];
  private destroy$ = new Subject<void>();

  // Pagination
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  totalFiles = 0;

  constructor(
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService,
    private fileUploadStateService: FileUploadStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fileUploadStateService.file$
      .pipe(takeUntil(this.destroy$))
      .subscribe(file => {
        this.selectedFile = file;
        this.cdr.markForCheck();
      });
    this.loadFiles();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        this.notificationService.showError('Failed to load files. Please try again.');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFiles();
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0] || null;
    if (file && this.isValidFile(file)) {
      this.fileUploadStateService.setFile(file);
    } else {
      this.notificationService.showError('Invalid file. Please select a valid image or video file under 50MB.');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0] || null;
    if (file && this.isValidFile(file)) {
      this.fileUploadStateService.setFile(file);
    } else {
      this.notificationService.showError('Invalid file. Please drop a valid image or video file under 50MB.');
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe({
        next: (progress: number) => {
          this.uploadProgress = progress;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error uploading file', error);
          this.notificationService.showError('File upload failed. Please try again.');
        },
        complete: () => {
          this.notificationService.showSuccess('File uploaded successfully');
          this.fileUploadStateService.setFile(null);
          this.uploadProgress = 0;
          this.loadFiles();
        }
      });
    }
  }

  private isValidFile(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }
}