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
  penalty_start: Date | string;
  penalty_end: Date | string;
  creator: string;
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
  popupMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBlacklist();
  }

  getBlacklist() {
    this.http.get<Blacklist[]>('http://localhost:3000/api/blacklist')
      .subscribe(data => this.blacklist = data);
  }

  editBlacklist(item: Blacklist) {
    const id = item.id;
    const payload = {
      ...item,
      penalty_start: this.formatDateSave(item.penalty_start),
      penalty_end: item.penalty_end ? this.formatDateSave(item.penalty_end) : null,
    };    

    this.http.put(`http://localhost:3000/api/blacklist/${id}`, payload)
      .subscribe({
      next: () => {
        this.popupMessage = 'Cập nhật thành công';
        this.getBlacklist();
        setTimeout(() => (this.popupMessage = ''), 3000);
      },
      error: (err) => {
        this.popupMessage = 'Cập nhật thất bại: ' + err.error?.message;
        setTimeout(() => (this.popupMessage = ''), 3000);
      },
    });
  }

  deleteBlacklist(item: Blacklist) {
    const id = item.id;
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xoá mục này?')) return;

    this.http.delete(`http://localhost:3000/api/blacklist/${id}`).subscribe({
      next: () => {
        this.popupMessage = 'Xoá thành công';
        this.getBlacklist();
        setTimeout(() => (this.popupMessage = ''), 3000);
      },
      error: (err) => {
        this.popupMessage = 'Xoá thất bại: ' + err.error?.message;
        setTimeout(() => (this.popupMessage = ''), 3000);
      },
    });
  }

  addBlacklist(newItem: Blacklist) {
    const payload = {
      ...newItem,
      penalty_start: this.formatDateSave(newItem.penalty_start),
      penalty_end: newItem.penalty_end ? this.formatDateSave(newItem.penalty_end) : null,
    };

    this.http.post('http://localhost:3000/api/blacklist', payload)
      .subscribe({
        next: () => {
          this.popupMessage = 'Thêm thành công';
          this.getBlacklist();
          setTimeout(() => (this.popupMessage = ''), 3000);
        },
        error: (err) => {
          this.popupMessage = 'Thêm thất bại: ' + err.error?.message;
          setTimeout(() => (this.popupMessage = ''), 3000);
        },
      });
  }

  showAddPopup = false;
  newItem = {
    cccd: '',
    fullname: '',
    company: '',
    violation: '',
    penalty_start: '',
    penalty_end: '',
    creator: '',
    note: ''
  };

  openAddPopup() {
    this.showAddPopup = true;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  submitAddForm() {
  if (!this.newItem.penalty_start || !this.newItem.penalty_end || !this.newItem.cccd || !this.newItem.fullname || !this.newItem.company || !this.newItem.violation) {
    this.popupMessage = 'Vui lòng điền đầy đủ thông tin!';
    setTimeout(() => this.popupMessage = '', 2000);
    return;
  }

  this.addBlacklist(this.newItem);
  this.showAddPopup = false;
  this.popupMessage = 'Thêm thành công!';
  setTimeout(() => this.popupMessage = '', 2000);
}



  formatDateTimeDisplay(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  

  formatDateSave(date: string | Date): string | null {
    if (!date) return null;
    const d= new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } 

  formatDateDisplay(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}