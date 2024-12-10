import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute } from '@angular/router';
import { SharedStateService } from '../service/shared-state.service';
import { NotificationService } from '../service/notification.service';
import { Chat } from '../models/chat.model';
import { User } from '../models/user.model';
import { AuthService } from '../service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  messageContent: string = '';
  chat: Chat|undefined;
  currentUsername:string = 'User1';
  @ViewChild('chatMessages') private chatMessagesContainer: ElementRef= new ElementRef(null);
  
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedStateService: SharedStateService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUserName()||'User1';
    this.chatService.getChat(this.sharedStateService.getUserId(),this.sharedStateService.getChatId()).subscribe(
      (chat) => {
        this.chat = chat
        this.chat.messages = this.chat.messages.sort((a, b) => {
          const dateA = new Date(a.timestamp); // Pretvori timestamp u Date objekat
          const dateB = new Date(b.timestamp); // Pretvori timestamp u Date objekat
          return dateA.getTime() - dateB.getTime(); // Sortiraj po vremenu
        });
      },
      (error) => {
        console.log(error);
        this.notificationService.notify('Error during opening chat',
          3000, true);
      }
    );
  }

  sendMessage() {
    const message = { content: this.messageContent, sender: 'User1' };
    this.chatService.sendMessage(this.sharedStateService.getChatId(), message);
    this.messageContent = '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}