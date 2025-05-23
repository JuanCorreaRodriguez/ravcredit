import {Component, input} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {Location} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-sub-toolbar',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './sub-toolbar.component.html',
  styleUrl: './sub-toolbar.component.css'
})
export class SubToolbarComponent {
  title = input.required<string>()

  constructor(private location: Location) {
  }

  goBack() {
    this.location.back()
  }

}
