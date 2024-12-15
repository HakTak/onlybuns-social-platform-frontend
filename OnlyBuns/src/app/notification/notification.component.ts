import { Component } from '@angular/core';
import { NotificationType } from '../models/notificationType.enum';

interface Notification {
  message: string;
  timeout: number;
  action?: string;
  notificationType: NotificationType;
  actionCallback?: () => void;
  removing?: boolean; // Ovo je potrebno za animaciju uklanjanja
  backgroundColor?: string; // Dodatna boja za obaveštenje
}


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  notifications: Notification[] = [];
  backgroundColor: string = 'default'; // Dodatna boja za obaveštenje

  showNotification(
    message: string,
    duration: number = 3000,
    action?: string,
    actionCallback?: () => void,
    backgroundColor?: string
  ) {
    const notification: Notification = { message, timeout: duration+2000, action, actionCallback, backgroundColor, notificationType: NotificationType.ERROR };
    this.notifications.push(notification);

    // Automatsko uklanjanje nakon trajanja
    setTimeout(() => {
      this.startRemovingNotification(notification);
    }, duration);
  }

  startRemovingNotification(notification: Notification) {
    notification.removing = true; // Dodaj klasu za izlazak

    // Ukloni iz liste nakon završetka animacije
    setTimeout(() => {
      this.notifications = this.notifications.filter((n) => n !== notification);
    }, 300); // Trajanje `slideOut` animacije
  }

  handleAction(notification: Notification) {
    if (notification.actionCallback) {
      notification.actionCallback(); // Poziv callback-a
    }
    this.startRemovingNotification(notification); // Odmah ukloni obaveštenje
  }
}