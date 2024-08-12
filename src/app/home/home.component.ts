import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-background">
      <app-header></app-header>
      <main class="flex-grow p-6">
        <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-primary">File Upload</h1>
            <p class="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button class="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg">
              Read More
            </button>
          </div>
          <div class="flex-1 mt-8 md:mt-0">
            <img src="https://placehold.co/400x300" alt="File Upload Illustration" class="w-full h-auto" />
          </div>
        </div>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent { }