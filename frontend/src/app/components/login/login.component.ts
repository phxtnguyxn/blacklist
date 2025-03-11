import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, NgIf, HttpClientModule],
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  isError = false;
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log('🛠️ Gửi yêu cầu đăng nhập:', this.username, this.password);

    this.http.post<any>('http://localhost:3000/api/login', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (response) => {
        console.log('✅ Đăng nhập thành công!', response);
        localStorage.setItem('token', response.token); // Store the token

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Lỗi đăng nhập:', error);
        this.message = '❌ Sai username hoặc password!';
        this.isError = true;
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
}