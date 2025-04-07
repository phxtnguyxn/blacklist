import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { TopNavbarComponent } from '../../components/navbar/top-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopNavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  // 🛠 Hàm điều hướng đến trang blacklist
  goToBlacklist() {
    this.router.navigate(['/guard/blacklist']);
  }
}
