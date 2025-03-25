import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // ✅ Import ReactiveFormsModule
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'blacklist',
  standalone: true,
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css'],
  imports: [
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    ReactiveFormsModule, // ✅ Thêm module này vào
  ],
})
export class GuardBlacklistComponent {
  searchData = new FormControl('');

  onSubmit() {
    console.log("Dữ liệu nhập:", this.searchData.value);
  }
}
