import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatIconModule, NgFor, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  role: string = '';
  menu: any[] = [];

  adminMenu = [
    { icon: 'person', label: 'Người dùng', route: '/admin-user' },
    { icon: 'shield', label: 'Danh sách đen', route: '/blacklist' },
    { icon: 'inventory_2', label: 'Lịch ký', route: '/assets' },
    { icon: 'login', label: 'Entrance', route: '/entrance' },
    { icon: 'language', label: 'Network Security', route: '/network-security' },
    { icon: 'smartphone', label: 'PC/Mobile Security', route: '/pc-mobile-security' },
    { icon: 'more_horiz', label: 'Etc', route: '/etc' }
  ];

  guardMenu = [
    { icon: 'login', label: 'Entrance', route: '/entrance' },
    { icon: 'shield', label: 'Danh sách đen', route: '/security-status' }
  ];

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.role = user.role;

    if (this.role === 'Admin') {
      this.menu = this.adminMenu;
    } else if (this.role === 'Guard') {
      this.menu = this.guardMenu;
    }
  }
}
