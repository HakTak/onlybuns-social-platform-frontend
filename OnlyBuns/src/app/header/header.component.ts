import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service';
import { UserService } from '../service/user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('2s', style({
          opacity: 1
        }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private userService: UserService, private authService: AuthService) {
    this.username = this.authService.getCurrentUserName() || '';
  }

  ngOnInit() {
  }

  hasSignedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  userName() {
    const user = this.userService.currentUser;
    this.username=user.userName;
    return user.userName
  }
  logout() {
    this.authService.logout();
  }
}
