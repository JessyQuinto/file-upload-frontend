import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="space-x-4">
      <a routerLink="/" class="text-primary hover:underline">Home</a>
      <a routerLink="/upload" class="text-primary hover:underline">Upload</a>
    </nav>
  `
})
export class NavigationComponent { }