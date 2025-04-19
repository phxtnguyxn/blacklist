import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard'; // ✅ Import roleGuard
import { GuardBlacklistComponent } from './pages/guard/blacklist/blacklist.component';
import { AdminUserComponent } from './pages/admin/user/admin-user.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component'; // ✅ Import UnauthorizedComponent

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-user',
    component: AdminUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] } // ✅ Chỉ cho phép vai trò 'admin'
  },
  {
    path: 'guard/blacklist',
    component: GuardBlacklistComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Guard', 'Staff'] } // ✅ Cho phép vai trò 'guard' và 'staff'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent // ✅ Trang hiển thị khi không có quyền truy cập
  },
  { path: '**', redirectTo: 'login' } // Luôn để ** ở cuối
];
