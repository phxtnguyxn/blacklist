import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent}, // Chặn truy cập nếu chưa đăng nhập
  { path: '**', redirectTo: '', pathMatch: 'full' }, 
];