import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<h1 class="welcome">Welcome home!</h1>`,
  styles: [`
    .welcome {
      text-align: center;
      margin-top: 50px;
      font-size: 24px;
      color: #2c3e50;
    }
  `],
  imports: [CommonModule],
})
export class HomeComponent {}