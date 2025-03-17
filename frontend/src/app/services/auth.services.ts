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

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { username, password });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false; // Nếu đang chạy trên server, trả về false
  }
}
