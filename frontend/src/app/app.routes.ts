import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { GuardBlacklistComponent } from './pages/guard/blacklist/blacklist.component'; // ✅ Import GuardBlacklistComponent

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'guard/blacklist', component: GuardBlacklistComponent, canActivate: [authGuard] }, // Đưa lên trước
  { path: '**', redirectTo: 'login' } // Luôn để ** ở cuối
];

