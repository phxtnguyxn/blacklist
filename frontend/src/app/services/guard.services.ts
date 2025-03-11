import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Kiểm tra token lưu trong localStorage

  if (!token) {
    router.navigate(['/login']); // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
    return false;
  }

  return true;
};
