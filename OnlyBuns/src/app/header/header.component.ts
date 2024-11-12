import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service';
import { UserService } from '../service/user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

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
  email: string;

  constructor(private userService: UserService, 
    public authService:AuthService,
    private router: Router
  ) {
    this.email = this.authService.getCurrentUserName() || '';
  }

  ngOnInit() {
    this.email = this.authService.getCurrentUserName() || '';
  }

  hasSignedIn(): boolean {
    this.email = this.authService.getCurrentUserName() || '';
    return this.authService.isAuthenticated();
  }

  goToProfile() {
    var username = '';
    this.userService.getUserByEmail(this.email).subscribe(
      (data: any) => {
        username = data.username;
        this.router.navigate(['/profile', username]);
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  userName() {
    const user = this.userService.currentUser;
    this.email = user.userName;
    return user.userName
  }
  logout() {
    this.authService.logout();
  }
  showUsers() {
    this.router.navigate(['/users']);
  }
}
