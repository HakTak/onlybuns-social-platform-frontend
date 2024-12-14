import { Component, ViewChild } from '@angular/core';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './service/notification.service';
import { SharedStateService } from './service/shared-state.service';
import { AuthService, UserService } from './service';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;
  public showChat = false;
  title = 'spring-security-front-app';

  constructor(
    private notificationService: NotificationService,
    private sharedStateService: SharedStateService,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.sharedStateService.showChat$.subscribe((value) => {
      this.showChat = value;
    });
  }

  showCloseChat() {
    this.sharedStateService.toggleShowChat();
  }

  ngAfterViewInit() {
    this.notificationService.register(this.notificationComponent);
  }
}
