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
  menu = [
    { icon: 'person', label: 'User', route: '/admin-user' },
    { icon: 'shield', label: 'Security Status', route: '/security-status' },
    { icon: 'login', label: 'Entrance', route: '/entrance' },
    { icon: 'inventory_2', label: 'Assets', route: '/assets' },
    { icon: 'language', label: 'Network Security', route: '/network-security' },
    { icon: 'smartphone', label: 'PC/Mobile Security', route: '/pc-mobile-security' },
    { icon: 'more_horiz', label: 'Etc', route: '/etc' }
  ];
}
