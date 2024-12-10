import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedStateService } from '../service/shared-state.service';
import { Chat } from '../models/chat.model';
import { AuthService, UserService } from '../service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css']
})
export class AllChatsComponent implements OnInit {
  newChatName: string = ''; // Naziv za novi čet
  chatId: number = 0;
  chats: Chat[] = [];
  currentUsername:string = 'User1';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedStateService: SharedStateService,
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  changeShowingChat() {
    this.sharedStateService.toggleShowChat();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.currentUsername = this.authService.getCurrentUserName()||'User1';
    this.userService.getMyChats().subscribe((value) => {
      this.chats = value.chats;
    },
    (error) => {
      console.log(error);
      this.notificationService.notify('Unable to load chats',3000,true);
    });
    this.sharedStateService.chatId$.subscribe((value) => {
      this.chatId = value;
    });
  }

  openChat(chatId: number): void {
    // Navigacija na određeni čet
    this.sharedStateService.setChatId(chatId);
  }

  returnToChats(): void {
    // Navigacija na određeni čet
    this.loadData();
    this.sharedStateService.setChatId(0);
  }

  addNewChat(): void {
    // Poziv API-ja za kreiranje novog četa
    if (this.newChatName.trim()) {
      this.chatService.createChat(this.newChatName).subscribe((newChat) => {
        this.chats.push(newChat); // Dodaj novi čet u listu
        this.newChatName = ''; // Resetuj polje
        this.openChat(newChat.id); // Otvori novi čet
      });
    }
  }
}