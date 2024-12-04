import { Component } from '@angular/core';

interface Notification {
  message: string;
  timeout: number;
  action?: string;
  actionCallback?: () => void;
  removing?: boolean; // Ovo je potrebno za animaciju uklanjanja
}


@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div
        class="notification"
        *ngFor="let notification of notifications; let i = index"
        [style.bottom.px]="16 + i * 70"
        [class.removing]="notification.removing">
        <span>{{ notification.message }}</span>
        <button *ngIf="notification.action" (click)="handleAction(notification)">
          {{ notification.action }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  notifications: Notification[] = [];

  showNotification(
    message: string,
    duration: number = 3000,
    action?: string,
    actionCallback?: () => void
  ) {
    const notification: Notification = { message, timeout: duration, action, actionCallback };
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
