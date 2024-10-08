import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FileUploadService } from '../services/file-upload.service';
import { NotificationService } from '../services/notification.service';
import { FileItem } from '../components/file-upload/file-upload.model';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatIconModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit {
  @Input() files: FileItem[] = [];
  @Input() totalFiles: number = 0;
  @Input() pageSize: number = 12;
  @Input() pageSizeOptions: number[] = [12, 24, 48, 96];

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() fileDeleted = new EventEmitter<void>();

  constructor(
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('FileListComponent initialized');
  }

  onPageChange(event: PageEvent) {
    console.log('Page changed:', event);
    this.pageChange.emit(event);
  }

  downloadFile(id: number, fileName: string) {
    console.log('Downloading file:', fileName, 'ID:', id);
    this.fileUploadService.getFile(id).subscribe({
      next: (blob) => {
        console.log('File downloaded:', fileName, 'Size:', blob.size);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.notificationService.showError('Failed to download file. Please try again.');
      }
    });
  }

  deleteFile(id: number) {
    console.log('Deleting file with ID:', id);
    this.fileUploadService.deleteFile(id).subscribe({
      next: () => {
        console.log('File deleted successfully');
        this.notificationService.showSuccess('File deleted successfully');
        this.fileDeleted.emit();
      },
      error: (error) => {
        console.error('Error deleting file:', error);
        this.notificationService.showError('Failed to delete file. Please try again.');
      }
    });
  }

  isImageFile(contentType: string): boolean {
    return contentType.startsWith('image/');
  }
}