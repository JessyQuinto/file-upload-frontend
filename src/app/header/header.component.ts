import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NavigationComponent, RouterModule]
})
export class HeaderComponent { }
