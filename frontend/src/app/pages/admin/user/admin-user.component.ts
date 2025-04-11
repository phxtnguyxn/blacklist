import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id?: number;
  username: string;
  password?: string;
  fullName: string;
  role: string;
}

@Component({
  selector: 'app-admin-user',
  standalone: true,
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminUserComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    username: '',
    password: '',
    fullName: '',
    role: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<User[]>('http://localhost:3000/api/users')
      .subscribe(data => this.users = data);
  }

  addUser() {
    this.http.post('http://localhost:3000/api/users', this.newUser)
      .subscribe(() => {
        this.newUser = { username: '', password: '', fullName: '', role: '' };
        this.getUsers();
      });
  }

  updateUser(user: User) {
    this.http.put(`http://localhost:3000/api/users/${user.id}`, user)
      .subscribe(() => this.getUsers());
  }

  deleteUser(user: User) {
    this.http.delete(`http://localhost:3000/api/users/${user.id}`)
      .subscribe(() => this.getUsers());
  }
}
