import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login';
  private http = inject(HttpClient);
  private router = inject(Router);

  login(username: string, password: string): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('role', response.user.role); // Lưu vai trò
        }
      })
    );
  }
  
  
  

  // ✅ Logout: Xóa cả token và session
  logout() {
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('user'); 
    this.router.navigate(['/login']);
  }

  // ✅ Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false; // Đang chạy trên server => không thể xác thực
    }
  
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }
}


