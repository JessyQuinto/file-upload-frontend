// src/app/models/file-upload.model.ts

export interface FileItem {
  id: number;
  nombre: string;
  blobUrl: string;
  contentType: string;
  uploadedAt: string;
}

export interface FileResponse {
  items: FileItem[];
  totalItems: number;
}
  