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
  chat: Chat | undefined;
  currentUsername: string = 'User1';
  @ViewChild('chatMessages') private chatMessagesContainer: ElementRef = new ElementRef(null);
  groupedMessages: { date: string; messages: Message[] }[] = [];
  isAtBottom: boolean = true;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedStateService: SharedStateService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUsername = this.authService.getUserName() || 'User1';
    this.chatService.getChat(this.sharedStateService.getUserId(), this.sharedStateService.getChatId()).subscribe(
      (chat) => {
        this.chat = chat
        // alert("Chat id:"+this.chat?.id)
        this.chatService.openSocket(this.chat?.id);
        this.sharedStateService.setChatId(this.chat?.id || -1);
        this.chat.messages = this.chat.messages.sort((a, b) => {
          const dateA = new Date(a.timestamp ?? 0); // Pretvori timestamp u Date objekat
          const dateB = new Date(b.timestamp ?? 0); // Pretvori timestamp u Date objekat
          return dateA.getTime() - dateB.getTime(); // Sortiraj po vremenu
        });
        this.chat.name = chat?.name?.replace(this.currentUsername, '')?.replace('-', '')
        this.groupedMessages = this.groupMessagesByDate(this.chat.messages);
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
    const messageDate = new Date(message.timestamp).toDateString(); // Datum poruke

    // Pronađi postojeću grupu za datum
    const group = this.groupedMessages.find(group => group.date === messageDate);

    if (group) {
      // Dodaj poruku u postojeću grupu
      group.messages.push(message);

      // Sortiraj poruke unutar grupe po vremenu
      group.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else {
      // Ako grupa za datum ne postoji, kreiraj novu
      this.groupedMessages.push({
        date: messageDate,
        messages: [message]
      });

      // Sortiraj grupe po datumu (najnoviji na dnu)
      this.groupedMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Skroluj na dno nakon dodavanja poruke
    this.scrollToBottom();
  }

  goToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  sendMessage() {
    this.chatService.sendMessage(this.chat?.id || -1, this.messageContent);
    this.messageContent = '';
  }

  ngAfterViewInit(): void {
    const observer = new MutationObserver(() => {
      this.scrollToBottom();
    });

    observer.observe(this.chatMessagesContainer.nativeElement, {
      childList: true, // Prati promene u broju dece
      subtree: true,   // Prati promene u svim nivoima DOM stabla
    });
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  groupMessagesByDate(messages: Message[]): any[] {
    const groupedMessages = messages.reduce((acc: { [key: string]: Message[] }, message) => {
      const date = new Date(message.timestamp).toDateString(); // Formatirajte datum
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});

    return Object.entries(groupedMessages).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  }

  onScroll(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.chatMessagesContainer.nativeElement;
    this.isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Tolerancija od 10px
  }

}