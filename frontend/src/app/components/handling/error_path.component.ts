import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services'; // điều chỉnh path đúng theo bạn

@Component({
  selector: 'app-not-found-redirect',
  standalone: true,
  template: ''
})
export class NotFoundRedirectComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Xóa session, token, role, username...
    this.authService.logout(); // logout() đã xử lý clear mọi thứ rồi

    // Chuyển về trang login
    this.router.navigate(['/login']);
  }
}
