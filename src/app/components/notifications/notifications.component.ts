import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {oClient} from '../../core/interfaces/oClient';
import {oContract} from '../../core/interfaces/oContract';
import {oNotification} from '../../core/interfaces/oNotification';

@Component({
  selector: 'app-notifications',
  imports: [
    MatIcon
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css', '../dashboard/dashboard.component.css']
})
export class NotificationsComponent {
  client = input.required<oClient>();
  contract = input.required<oContract>()
  notification = input.required<oNotification[]>()
}
