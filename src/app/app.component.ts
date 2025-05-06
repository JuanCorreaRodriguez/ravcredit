import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ravcredit';

  constructor(public matIconReg: MatIconRegistry) {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
