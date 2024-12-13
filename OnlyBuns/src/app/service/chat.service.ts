import { Injectable, Input } from '@angular/core';
import * as StompJs from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { Chat, Message } from '../models/chat.model';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { SharedStateService } from './shared-state.service';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  @Input() fromChat: boolean = false;
  private stompClient: any;
  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];
  private subscribedTopics: Map<string, string> = new Map(); // Mapiranje topic -> subscription ID



  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private sharedStateService: SharedStateService,
    private userService: UserService,
  ) {
    this.initializeWebSocketConnection();
  }

  getChat(userId: number, chatId: number): Observable<Chat> {
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

  createChat(name: string): Observable<Chat> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.post<Chat>(this.config.chat_url+ `/${name}`,{},{headers}).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          this.notificationService.notify('You must be logged as User', 3000, true);
        }
        return throwError(() => error);
      })
    );
  }

  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    const ws = new SockJS(this.config.socket_url);
    this.stompClient = StompJs.Stomp.over(ws);

    const reconnectInterval = 5000; // Interval za ponovno povezivanje u milisekundama
    const maxReconnectAttempts = 10; // Maksimalan broj pokušaja za ponovno povezivanje
    let reconnectAttempts = 0;
    this.stompClient.heartbeat.incoming = 4000; // Klijent očekuje heartbeat od servera svakih 10 sekundi
    this.stompClient.heartbeat.outgoing = 5000; // Klijent šalje heartbeat serveru svakih 5 sekundi


    const connectCallback = () => {
      console.log('WebSocket connection successfully established.');
      this.isLoaded = true;
      reconnectAttempts = 0; // Resetuj broj pokušaja nakon uspešne konekcije
      // alert(this.authService.getRole());
      if (this.authService.getRole() === 'AUTHENTICATED') {
        this.userService.getMyChats().subscribe(
          (user) => {
            for (let chat of user.chats) {
              this.openSocket(chat.id);
            }
          },
          (error) => {
            console.log(error);
            this.notificationService.notify('Error during loading chats', 3000, true);
          }
        );
      }
      //this.openGlobalSocket();
    };

    const errorCallback = (error: any) => {
      console.error('WebSocket connection failed:', error);

      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Reconnect attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
        setTimeout(() => this.initializeWebSocketConnection(), reconnectInterval);
      } else {
        console.error('Maximum reconnect attempts reached. Connection failed permanently.');
      }
    };

    // Povezivanje sa callback-ovima
    this.stompClient.connect({}, connectCallback, errorCallback);
  }


  // Funkcija salje poruku na WebSockets endpoint na serveru
  sendMessage(chatId: number, content: string) {
    if (content != null && content.trim() != "") {
      let message: Message = {
        content: content,
        sender: { id: 0, username: this.authService.getUserName() || '', email: '', firstname: '', lastname: '', numberOfPosts: '0', userFollowedByMe: false, followersCount: 0, followingCount: 0, chats: [] },
        senderUsername: this.authService.getUserName() || '',
        chatId: chatId,
        timestamp: new Date(),
      };

      // Primer slanja poruke preko web socketa sa klijenta. URL je 
      //  - ApplicationDestinationPrefix definisan u config klasi na serveru (configureMessageBroker() metoda) : /socket-subscriber
      //  - vrednost @MessageMapping anotacije iz kontrolera na serveru : /send/message
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  // Funckija za pretplatu na topic /socket-publisher (definise se u configureMessageBroker() metodi)
  // Globalni socket se otvara prilikom inicijalizacije klijentske aplikacije
  // openGlobalSocket() {
  //   if (this.isLoaded) {
  //     const topic = "/socket-publisher";

  //     if (this.subscribedTopics.has(topic)) {
  //       console.log(`Already subscribed to topic: ${topic}`);
  //       return;
  //     }

  //     this.stompClient.subscribe(topic, (message: { body: string }) => {
  //       this.handleResult(message);
  //     });

  //     this.subscribedTopics.add(topic);
  //     console.log(`Subscribed to global topic: ${topic}`);
  //   }
  // }


  // Funkcija za pretplatu na topic /socket-publisher/user-id
  // CustomSocket se otvara kada korisnik unese svoj ID u polje 'fromId' u submit callback-u forme 'userForm'
  openSocket(chatId: number) {
    if (this.isLoaded) {
      const topic = "/socket-publisher/" + chatId;
  
      if (this.subscribedTopics.has(topic)) {
        console.log(`Already subscribed to topic: ${topic}`);
        return;
      }
  
      const subscription = this.stompClient.subscribe(topic, (message: { body: string }) => {
        this.handleResult(message);
      });
  
      this.subscribedTopics.set(topic, subscription.id); // Sačuvajte ID pretplate
      console.log(`Subscribed to topic: ${topic}`);
    }
  }
  
  unsubscribe() {
    this.subscribedTopics.forEach((value, key) => {
      this.stompClient.unsubscribe(value);
      this.unsubscribeFromTopic(key);
    });
  }

  unsubscribeFromTopic(topic: string) {
    const subscriptionId = this.subscribedTopics.get(topic); // Preuzmite ID pretplate
  
    if (subscriptionId) {
      this.stompClient.unsubscribe(subscriptionId); // Odjavite se koristeći ID
      this.subscribedTopics.delete(topic); // Uklonite topic iz mape
      console.log(`Unsubscribed from topic: ${topic}`);
    } else {
      console.warn(`No subscription found for topic: ${topic}`);
    }
  }
  
  


  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      if (this.sharedStateService.getChatId() != messageResult.chatId) {
        //alert('New message from ' + messageResult.senderUsername + ' in chat ' + messageResult.chatId);
        this.notificationService.notify(messageResult.senderUsername + ': ' + messageResult.content, 3000, false);
      } else {
        this.messageSubject.next(messageResult);
      }
    }
  }
}
