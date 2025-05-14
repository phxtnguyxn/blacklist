import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopnavComponent } from '../../../components/topnav/topnav.component';
import { SidenavComponent } from '../../../components/sidenav/sidenav.component';


interface Blacklist {
  id?: number;
  cccd: string;
  fullname: string;
  company: string;
  violation: string;
  penalty_start: Date;
  penalty_end: Date;
  created_by: string;
  created_at: Date;
  note: string;
}

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [CommonModule, FormsModule, TopnavComponent, SidenavComponent],
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit {
  blacklist: Blacklist[] = [];
  newBlacklist: Blacklist = {
    cccd: '',
    fullname: '',
    company: '',
    violation: '',
    penalty_start: new Date(),
    penalty_end: new Date(),
    created_by: '',
    created_at: new Date(),
    note: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBlacklist();
  }

  getBlacklist() {
    this.http.get<Blacklist[]>('http://localhost:3000/api/blacklist')
      .subscribe(data => this.blacklist = data);
  }

  popupMessage: string | null = null;

  showPopup(message: string) {
    this.popupMessage = message;
    setTimeout(() => this.popupMessage = null, 3000); 
  }

  editBlacklist(item: Blacklist) {
    const formattedItem = {
      ...item,
      penalty_start: this.formatDateToMySQL(item.penalty_start),
      penalty_end: this.formatDateToMySQL(item.penalty_end),
      created_at: this.formatDateToMySQL(item.created_at),
    };
  
    this.http.put(`/api/blacklist/${item.id}`, formattedItem).subscribe({
      next: () => {
        this.getBlacklist();
        this.showPopup('Cập nhật thành công!');
      },
      error: () => this.showPopup('Lỗi khi cập nhật!')
    });
  }
  
  formatDateToMySQL(date: Date | string): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  
  formatDateDisplay(dateStr: Date | string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  
  
  deleteBlacklist(blacklist: Blacklist) {
    this.http.delete(`http://localhost:3000/api/blacklist/${blacklist.id}`)
      .subscribe({
        next: () => {
          this.getBlacklist();
          this.showPopup('Xóa thành công!');
        },
        error: () => this.showPopup('Xóa thất bại!')
      });
  }
}

