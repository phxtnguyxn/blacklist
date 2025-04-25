import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css'],
  providers: [DatePipe]
})
export class BlacklistComponent implements OnInit {
  blacklist: any[] = [];

  searchModel = {
    cccd: '',
    fullname: '',
    checked_by_id: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllBlacklist(); // dùng GET để lấy tất cả dữ liệu
  }

  getAllBlacklist(): void {
    this.http.get<any[]>('/api/blacklist').subscribe(data => {
      this.blacklist = data;
    });
  }

  search(): void {
    const { cccd, fullname, checked_by_id } = this.searchModel;
    if (!cccd && !fullname && !checked_by_id) {
      this.getAllBlacklist(); // nếu không có điều kiện lọc, lấy tất cả
      return;
    }
  
    this.http.post<any[]>('/api/blacklist/search', this.searchModel).subscribe(data => {
      this.blacklist = data;
    });
  }
  

  edit(entry: any): void {
    console.log('Edit entry:', entry);
  }

  delete(id: number): void {
    if (confirm('Bạn có chắc muốn xoá mục này không?')) {
      this.http.delete(`/api/blacklist/${id}`).subscribe(() => {
        this.blacklist = this.blacklist.filter(item => item.id !== id);
      });
    }
  }

  openAddModal(): void {
    console.log('Open add modal');
  }
}
