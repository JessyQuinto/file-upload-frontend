import { Component } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex justify-between items-center w-full p-4 bg-card">
      <div class="text-2xl font-bold text-primary">YOUR LOGO</div>
      <app-navigation></app-navigation>
    </header>
  `,
  imports: [NavigationComponent]
})
export class HeaderComponent { }