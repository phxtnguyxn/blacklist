import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopnavComponent } from '../../../components/topnav/topnav.component';
import { SidenavComponent } from '../../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [CommonModule, FormsModule, TopnavComponent, SidenavComponent],
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
    this.getAllBlacklist();
  }

  getAllBlacklist(): void {
    this.http.get<any[]>('/api/blacklist').subscribe(data => {
      this.blacklist = data;
    });
  }

  search(): void {
    const { cccd, fullname, checked_by_id } = this.searchModel;

    if (!checked_by_id?.trim()) {
      alert('Vui lòng nhập ID người tìm kiếm (User ID).');
      return;
    }

    // Gọi API với user ID được đính kèm query param
    const queryParams = `?user_id=${encodeURIComponent(checked_by_id.trim())}`;

    const body = {
      cccd: cccd?.trim(),
      fullname: fullname?.trim()
    };

    this.http.post<any[]>(`/api/blacklist/search${queryParams}`, body).subscribe(data => {
      this.blacklist = data;
    });
  }

  edit(entry: any): void {
    console.log('Edit entry:', entry);
    // TODO: Hiển thị form sửa
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
    // TODO: Hiển thị modal thêm mới
  }
}
