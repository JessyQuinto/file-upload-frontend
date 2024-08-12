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
            const total = event.total ?? 1;
            return Math.round((100 * event.loaded) / total);
          case HttpEventType.Response:
            return 100;
          default:
            return 0;
        }
      }),
      catchError(this.handleError)
    );
  }

  getFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  updateFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.put(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllFiles(page: number = 0, pageSize: number = 10): Observable<FileResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<FileResponse>(`${this.apiUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  testDbConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test-db-connection`)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
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