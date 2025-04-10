import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent {
  constructor(
    private router: Router,
    private authService: AuthService
) {}

  logout(): void {
    this.authService.logout();
    ;
  }

  username: string = '';
  ngOnInit(): void{
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }
}