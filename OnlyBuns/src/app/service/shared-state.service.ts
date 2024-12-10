// shared-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private showChatSubject = new BehaviorSubject<boolean>(false);
  showChat$ = this.showChatSubject.asObservable();

  private chatIdSubject = new BehaviorSubject<number>(0);
  chatId$ = this.chatIdSubject.asObservable();

  toggleShowChat() {
    this.showChatSubject.next(!this.showChatSubject.value);
  }

  setShowChat(value: boolean) {
    this.showChatSubject.next(value);
  }

  setShowChatAndChatId(value: boolean, chatId: number) {
    this.showChatSubject.next(value);
    this.chatIdSubject.next(chatId);
  }

  getShowChat() {
    return this.showChatSubject.value;
  }

  getChatId() {
    return this.chatIdSubject.value;
  }
}