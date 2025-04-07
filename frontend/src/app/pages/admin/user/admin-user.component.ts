import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminUserComponent implements OnInit {
  users: any[] = [];
  newUser: any = {
    username: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any[]>('http://localhost:3000/api/users')
      .subscribe(data => this.users = data);
  }

  addUser() {
    this.http.post('http://localhost:3000/api/users', this.newUser)
      .subscribe(() => {
        this.newUser = { username: '', password: '', fullname: '', role: '' };
        this.getUsers();
      });
  }

  updateUser(user: any) {
    this.http.put(`http://localhost:3000/api/users/${user.id}`, user)
      .subscribe(() => this.getUsers());
  }

  deleteUser(id: number) {
    this.http.delete(`http://localhost:3000/api/users/${id}`)
      .subscribe(() => this.getUsers());
  }
}
