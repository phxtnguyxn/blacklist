import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopnavComponent } from '../../../components/topnav/topnav.component';
import { SidenavComponent } from '../../../components/sidenav/sidenav.component';

interface User {
  id?: number;
  username: string;
  password?: string;
  fullname: string;
  role: string;
}

@Component({
  selector: 'app-admin-user',
  standalone: true,
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  imports: [CommonModule, FormsModule, TopnavComponent, SidenavComponent]
})
export class AdminUserComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    username: '',
    password: '',
    fullname: '',
    role: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<User[]>('http://localhost:3000/api/users')
      .subscribe(data => {
        this.users = data.map(user => ({
          ...user,
          originalPassword: user.password // lưu lại bản gốc
        }));
      });
  }

  popupMessage: string | null = null;

  showPopup(message: string) {
    this.popupMessage = message;
    setTimeout(() => this.popupMessage = null, 3000); 
  }

  addUser() {
    this.http.post('http://localhost:3000/api/users', this.newUser)
      .subscribe({
        next: () => {
          if (!this.newUser.username || !this.newUser.password || !this.newUser.fullname || !this.newUser.role) {
            this.showPopup('Vui lòng điền đầy đủ thông tin!');
            return;
          }
          this.newUser = { username: '', password: '', fullname: '', role: '' };
          this.getUsers();
          this.showPopup('Thêm người dùng thành công!');
        },
        error: () => this.showPopup('Thêm người dùng thất bại!')
      });
  }

  updateUser(user: User & { originalPassword?: string }) {
    const updatedUser = { ...user };
  
    if (!updatedUser.password || updatedUser.password.trim() === '' || updatedUser.password === updatedUser.originalPassword) {
      delete updatedUser.password;
    }
  
    this.http.put(`http://localhost:3000/api/users/${user.id}`, updatedUser)
      .subscribe({
        next: () => {
          this.getUsers();
          this.showPopup('Sửa người dùng thành công!');
        },
        error: () => this.showPopup('Sửa người dùng thất bại!')
      });
  }
  
  

  deleteUser(user: User) {
    this.http.delete(`http://localhost:3000/api/users/${user.id}`)
      .subscribe({
        next: () => {
          this.getUsers();
          this.showPopup('Xóa người dùng thành công!');
        },
        error: () => this.showPopup('Xóa người dùng thất bại!')
      });
  }
}