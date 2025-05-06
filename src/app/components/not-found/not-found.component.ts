import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [
    NgOptimizedImage,
    MatCard,
    RouterLink,
    MatButton
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
