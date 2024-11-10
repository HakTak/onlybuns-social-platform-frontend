import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';  // Pretpostavka da imate UserService


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  user: any;
  

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username) {
      this.loadUserProfile(this.username);
    }
  }

  loadUserProfile(username: string): void {
    this.userService.getUserByUsername(username).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }
  
}
