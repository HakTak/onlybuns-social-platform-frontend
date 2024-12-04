import { Component, ViewChild } from '@angular/core';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;
  title = 'spring-security-front-app';

  constructor(private notificationService: NotificationService) {}


  ngAfterViewInit() {
    this.notificationService.register(this.notificationComponent);
  }
}
