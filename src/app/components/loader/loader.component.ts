import {Component} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
