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

  editBlacklist(blacklist: Blacklist) {
    this.http.put(`http://localhost:3000/api/blacklist/${blacklist.id}`, blacklist)
      .subscribe(() => this.getBlacklist());
  }

  deleteBlacklist(blacklist: Blacklist) {
    this.http.delete(`http://localhost:3000/api/blacklist/${blacklist.id}`)
      .subscribe(() => this.getBlacklist());
  }
}

