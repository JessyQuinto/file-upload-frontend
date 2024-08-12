// src/app/services/file-upload.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileItem, FileResponse } from '../components/file-upload/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'https://localhost:7163/api/Productos';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log(`Upload progress: ${Math.round((100 * event.loaded) / (event.total ?? 1))}%`);
            return Math.round((100 * event.loaded) / (event.total ?? 1));
          case HttpEventType.Response:
            console.log('Upload complete:', event.body);
            return 100;
          default:
            return 0;
        }
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return this.handleError(error);
      })
    );
  }

  getFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' })
      .pipe(
        map(response => {
          console.log('File retrieved:', response);
          return response;
        }),
        catchError(error => {
          console.error('Get file error:', error);
          return this.handleError(error);
        })
      );
  }

  updateFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.put(`${this.apiUrl}/${id}`, formData)
      .pipe(
        map(response => {
          console.log('File updated:', response);
          return response;
        }),
        catchError(error => {
          console.error('Update file error:', error);
          return this.handleError(error);
        })
      );
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('File deleted:', response);
          return response;
        }),
        catchError(error => {
          console.error('Delete file error:', error);
          return this.handleError(error);
        })
      );
  }

  getAllFiles(page: number = 0, pageSize: number = 10): Observable<FileResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<FileResponse>(`${this.apiUrl}`, { params }).pipe(
      map(response => {
        console.log('Files retrieved:', response);
        return response;
      }),
      catchError(error => {
        console.error('Get all files error:', error);
        return this.handleError(error);
      })
    );
  }

  testDbConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test-db-connection`)
      .pipe(
        map(response => {
          console.log('Database connection test result:', response);
          return response;
        }),
        catchError(error => {
          console.error('Test DB connection error:', error);
          return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
