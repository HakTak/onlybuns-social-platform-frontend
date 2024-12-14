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

  private userIdSubject = new BehaviorSubject<number>(0);
  userId$ = this.chatIdSubject.asObservable();

  toggleShowChat() {
    this.showChatSubject.next(!this.showChatSubject.value);
  }

  setShowChat(value: boolean) {
    this.showChatSubject.next(value);
  }

  setShowChatAndChatIdandUserId(value: boolean, chatId: number, userId: number) {
    this.showChatSubject.next(value);
    this.chatIdSubject.next(chatId);
    this.userIdSubject.next(userId);
  }

  getShowChat() {
    return this.showChatSubject.value;
  }

  getChatId() {
    return this.chatIdSubject.value;
  }

  setChatId(value: number) {
    this.chatIdSubject.next(value);
  }

  getUserId() {
    return this.userIdSubject.value;
  }

  setUserId(value: number) {
    this.userIdSubject.next(value);
  }
}