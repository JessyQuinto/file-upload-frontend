import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadService } from '../../services/file-upload.service';
import { NotificationService } from '../../services/notification.service';
import { FileUploadStateService } from '../../services/file-upload-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatTableModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  files: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  private destroy$ = new Subject<void>();

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
    this.fileUploadService.getAllFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading files', error);
        this.notificationService.showError('Failed to load files. Please try again.');
      }
    });
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

  downloadFile(id: number, fileName: string) {
    this.fileUploadService.getFile(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file', error);
        this.notificationService.showError('Failed to download file. Please try again.');
      }
    });
  }

  deleteFile(id: number) {
    this.fileUploadService.deleteFile(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('File deleted successfully');
        this.loadFiles();
      },
      error: (error) => {
        console.error('Error deleting file', error);
        this.notificationService.showError('Failed to delete file. Please try again.');
      }
    });
  }

  private isValidFile(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }
}