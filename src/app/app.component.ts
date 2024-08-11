import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileUploadComponent],
  template: `
    <div class="container mx-auto p-4">
      <app-file-upload></app-file-upload>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'file-upload-frontend';
}