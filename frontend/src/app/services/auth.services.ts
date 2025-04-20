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

  // ✅ Helper để kiểm tra có đang ở browser không
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(username: string, password: string): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (this.isBrowser() && response.token) {
          localStorage.setItem('token', response.token);
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('role', response.user.role);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token'); 
      sessionStorage.removeItem('token'); 
      sessionStorage.removeItem('user'); 
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('username');
    }

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }
}
