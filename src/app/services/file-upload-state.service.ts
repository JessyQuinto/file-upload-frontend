import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadStateService {
  private fileSubject = new BehaviorSubject<File | null>(null);
  file$ = this.fileSubject.asObservable();

  setFile(file: File | null) {
    this.fileSubject.next(file);
  }
}