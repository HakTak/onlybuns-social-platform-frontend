import { Injectable, Input } from '@angular/core';
import { Message } from '@stomp/stompjs';
import * as StompJs from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { Chat } from '../models/chat.model';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  @Input() fromChat: boolean = false;
  private stompClient: StompJs.Client;
  private messages: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient, 
    private config: ConfigService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.stompClient = new StompJs.Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  getChat(userId: number,chatId:number): Observable<Chat> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.get<Chat>(this.config.chat_url + `/get/${userId}/${chatId}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          this.notificationService.notify('You must be logged as User', 3000, true);
        }
        if (error.status === 500) {
          this.notificationService.notify('Internal server error', 3000, true);
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  /*joinChat(chatId: number) {
    this.stompClient.subscribe(`/topic/chat/${chatId}`, (message: Message) => {
      const body = JSON.parse(message.body);
      this.messages.next([...this.messages.value, body]);
    });
  }*/

  sendMessage(chatId: number, message: any) {
    alert("chatId: " + chatId + " message: " + message.content);
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    /*this.stompClient.publish({
      destination: `/app/chat.sendMessage/${chatId}`,
      body: JSON.stringify(message),
      headers: { 'Authorization': `Bearer ${token}` }
    });*/
  }

  getChats(): Observable<any[]> {
    // Učitaj sve četove korisnika
    return this.http.get<any[]>(`${this.config.chat_url}`);
  }

  chatWithUser(userId: number): Observable<any> {
    // Kreiraj novi čet sa korisnikom
    return this.http.post<any>(`${this.config.chat_url}/user/${userId}`, {});
  }

  createChat(name: string): Observable<any> {
    // Kreiraj novi čet
    return this.http.post<any>(`${this.config.chat_url}`, { name });
  }
}
