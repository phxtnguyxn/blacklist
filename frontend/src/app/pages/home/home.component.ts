import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: AuthService) {
    if (!authService.isLoggedIn()) {
      window.location.href = '/login';
    }
  }

  logout() {
    this.authService.logout();
  }
}
