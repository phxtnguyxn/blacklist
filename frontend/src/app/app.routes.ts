import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './services/guard.services';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }, // Chặn truy cập nếu chưa đăng nhập
  { path: '**', redirectTo: '', pathMatch: 'full' }, 
];