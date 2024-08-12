// src/app/models/file-upload.model.ts

export interface FileItem {
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
  }
  
  export interface FileResponse {
    files: FileItem[];
    total: number;
  }
  