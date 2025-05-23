import {Component} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {SubToolbarComponent} from '../../common/sub-toolbar/sub-toolbar.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reference-conekta',
  imports: [
    MatCard,
    MatDivider,
    SubToolbarComponent,
    MatButton
  ],
  templateUrl: './reference-conekta.component.html',
  styleUrls: ['./reference-conekta.component.css', '../reference/reference.component.css']
})
export class ReferenceConektaComponent {

}
