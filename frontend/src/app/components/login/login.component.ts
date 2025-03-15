import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false; 

  private authService = inject(AuthService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword = !this.showPassword; 
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('isLoggedIn', 'true'); 
          }
          this.router.navigate(['/home']); 
        }
      },
      error: (err) => {
        console.error('Lỗi đăng nhập:', err);
      }
    });
  }
}
