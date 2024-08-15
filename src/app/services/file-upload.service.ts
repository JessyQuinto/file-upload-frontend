import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FileItem, FileResponse } from '../components/file-upload/file-upload.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'https://appwebupload-aug2gccncdguezhj.brazilsouth-01.azurewebsites.net/api/Productos';
  //private apiUrl = 'https://localhost:7163/api/Productos';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  uploadFile(file: File): Observable<number> {
    console.log('Uploading file:', file.name);
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
            const progress = Math.round((100 * event.loaded) / total);
            console.log(`Upload progress: ${progress}%`);
            return progress;
          case HttpEventType.Response:
            console.log('Upload completed');
            return 100;
          default:
            return 0;
        }
      }),
      catchError(this.handleError)
    );
  }

  getFile(id: number): Observable<Blob> {
    console.log('Getting file with id:', id);
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' })
      .pipe(
        tap(blob => console.log('File retrieved, size:', blob.size)),
        catchError(this.handleError)
      );
  }

  updateFile(id: number, file: File): Observable<any> {
    console.log('Updating file with id:', id);
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.put(`${this.apiUrl}/${id}`, formData)
      .pipe(
        tap(response => console.log('File updated:', response)),
        catchError(this.handleError)
      );
  }

  deleteFile(id: number): Observable<any> {
    console.log('Deleting file with id:', id);
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('File deleted:', response)),
        catchError(this.handleError)
      );
  }

  getAllFiles(page: number = 0, pageSize: number = 10): Observable<FileResponse> {
    console.log('Getting all files. Page:', page, 'PageSize:', pageSize);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<FileItem[]>(`${this.apiUrl}`, { params, observe: 'response' })
      .pipe(
        map(response => {
          const items = response.body || [];
          const totalItems = parseInt(response.headers.get('X-Total-Count') || '0', 10);
          return { items, totalItems };
        }),
        tap(response => console.log('Files retrieved:', response)),
        catchError(this.handleError)
      );
  }

  testDbConnection(): Observable<any> {
    console.log('Testing DB connection');
    return this.http.get(`${this.apiUrl}/test-db-connection`)
      .pipe(
        tap(response => console.log('DB connection test result:', response)),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred!';
    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}