import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login';
  private http = inject(HttpClient);
  private router = inject(Router);

  // ✅ Login: Sau khi đăng nhập, lưu token và user vào sessionStorage
  login(username: string, password: string): Observable<{ token: string, user: any }> {
    return new Observable(observer => {
      this.http.post<{ token: string, user: any }>(this.apiUrl, { username, password }).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token); // Lưu token vào localStorage
            sessionStorage.setItem('user', JSON.stringify(response.user)); // Lưu user vào sessionStorage
            observer.next(response);
            observer.complete();
          } else {
            observer.error("Login thất bại!");
          }
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // ✅ Logout: Xóa cả token và session
  logout() {
    localStorage.removeItem('token'); // Xóa token
    sessionStorage.removeItem('user'); // Xóa user khỏi sessionStorage
    this.router.navigate(['/login']);
  }

  // ✅ Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    return sessionStorage.getItem('user') !== null; // Kiểm tra user trong sessionStorage
  }
}
