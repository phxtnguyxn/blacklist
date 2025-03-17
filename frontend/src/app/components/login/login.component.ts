import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Đăng nhập thất bại! Kiểm tra lại username và password.');
      }
    }); 
  }
}
