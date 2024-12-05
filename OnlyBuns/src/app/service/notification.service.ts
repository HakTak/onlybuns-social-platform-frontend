import { Injectable } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationComponent!: NotificationComponent;

  register(notificationComponent: NotificationComponent) {
    this.notificationComponent = notificationComponent;
  }

  notify(
    message: string,
    duration: number = 3000,
    isWarn?: boolean, // Dodan opcioni parametar
    action?: string,
    actionCallback?: () => void,
  ) {
    if (this.notificationComponent) {
      const backgroundColor = isWarn ? 'red' : 'default'; // Primer kako postaviti boju
      this.notificationComponent.showNotification(
        message,
        duration,
        action,
        actionCallback,
        backgroundColor // Prosljeđivanje pozadine u komponentu
      );
    }
  }
}
