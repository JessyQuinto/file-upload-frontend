import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full p-4 bg-card text-center">
      <p class="text-muted-foreground">&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  `
})
export class FooterComponent { }
