import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadService } from '../../services/file-upload.service';
import { NotificationService } from '../../services/notification.service';
import { FileUploadStateService } from '../../services/file-upload-state.service';
import { Subject, takeUntil, Observable, throwError  } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  private destroy$ = new Subject<void>();

  @Output() fileUploaded = new EventEmitter<void>();

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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
          this.fileUploaded.emit();
          this.cdr.markForCheck();
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