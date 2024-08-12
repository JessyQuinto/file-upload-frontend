import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FileUploadService } from '../services/file-upload.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit {
  @Input() files: any[] = [];
  @Input() totalFiles: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() fileDeleted = new EventEmitter<void>();

  displayedColumns: string[] = ['id', 'nombre', 'actions'];

  constructor(
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
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
        this.fileDeleted.emit();
      },
      error: (error) => {
        console.error('Error deleting file', error);
        this.notificationService.showError('Failed to delete file. Please try again.');
      }
    });
  }
}
