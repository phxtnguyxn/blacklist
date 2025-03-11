import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient, private router: Router) {} // Inject Router vào constructor

  login(username: string, password: string) {
    return this.http.post(this.apiUrl, { username, password });
  }

  logout() {
    localStorage.removeItem('token'); // Xóa token
    this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
