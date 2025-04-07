import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      next: (response) => {
        console.log("Đăng nhập thành công!");
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Lỗi đăng nhập:", err);
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    }); 
  }
}
