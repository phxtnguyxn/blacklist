import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login';
  private router = inject(Router); 

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.apiUrl, { username, password });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false; // ✅ Fix lỗi khi chạy SSR
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
