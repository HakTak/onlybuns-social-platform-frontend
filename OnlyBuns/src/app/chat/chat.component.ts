import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedStateService } from '../service/shared-state.service';
import { NotificationService } from '../service/notification.service';
import { Chat, Message } from '../models/chat.model';
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
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUsername = this.authService.getUserName()||'User1';
    this.chatService.getChat(this.sharedStateService.getUserId(),this.sharedStateService.getChatId()).subscribe(
      (chat) => {
        this.chat = chat
        alert("Chat id:"+this.chat?.id)
        this.chatService.openSocket(this.chat?.id);
        this.chat.messages = this.chat.messages.sort((a, b) => {
          const dateA = new Date(a.timestamp ?? 0); // Pretvori timestamp u Date objekat
          const dateB = new Date(b.timestamp ?? 0); // Pretvori timestamp u Date objekat
          return dateA.getTime() - dateB.getTime(); // Sortiraj po vremenu
        });
        this.chat.name=chat?.name?.replace(this.currentUsername,'')?.replace('-','')
      },
      (error) => {
        console.log(error);
        this.notificationService.notify('Error during opening chat',
          3000, true);
      }
    );
    this.chatService.message$.subscribe((message) => {
      this.onNewMessage(message);
    });
  }

  onNewMessage(message: Message) {
    this.chat?.messages.push(message);
    this.scrollToBottom();
  }

  goToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  sendMessage() {
    this.chatService.sendMessage(this.chat?.id||-1, this.messageContent);
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