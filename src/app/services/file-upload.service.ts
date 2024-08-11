import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
            return Math.round((100 * event.loaded) / (event.total ?? 1));
          case HttpEventType.Response:
            return 100;
          default:
            return 0;
        }
      })
    );
  }

  getFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  testDbConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test-db-connection`);
  }
}