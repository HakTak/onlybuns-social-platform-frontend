import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedStateService } from '../service/shared-state.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css']
})
export class AllChatsComponent implements OnInit {
  chats: any[] = []; // Lista četova
  newChatName: string = ''; // Naziv za novi čet
  chatId: number = 0;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedStateService: SharedStateService
  ) { }

  changeShowingChat() {
    this.sharedStateService.toggleShowChat();
  }

  ngOnInit(): void {
    // Učitaj sve četove korisnika
    this.sharedStateService.chatId$.subscribe((value) => {
      this.chatId = value;
    });

    // this.chatService.getChats().subscribe((chats) => {
    //   this.chats = chats;
    // });
  }

  openChat(chatId: number): void {
    // Navigacija na određeni čet
    
  }

  returnToChats(): void {
    // Navigacija na određeni čet
    this.chatId = 0;
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