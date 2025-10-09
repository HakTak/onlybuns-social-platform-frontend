import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';  // Pretpostavka da imate UserService
import { Post } from '../models/posts.model';
import { PostService } from '../service/post.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, ConfigService } from '../service';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PostModificationComponent } from '../post-modification/post-modification.component';
import { NotificationService } from '../service/notification.service';
import { ChatService } from '../service/chat.service';
import { SharedStateService } from '../service/shared-state.service';
import { MapComponent } from '../map/map.component'; // Importujte komponentu mape
import { ViewChild } from '@angular/core';
import { NotificationType } from '../models/notificationType.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('likeAnimation', [
      state('liked', style({ /* stil za liked stanje */ })),
      state('unliked', style({ /* stil za unliked stanje */ })),
      transition('unliked => liked', animate('300ms ease-in')),
      transition('liked => unliked', animate('300ms ease-out'))
    ])
  ]
})
export class ProfileComponent implements OnInit {

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  username: string = '';
  user: any;
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 3;
  canGoNext: boolean = true;
  isThisMyProfile: boolean = false;
  showFollowers = false;
  showFollowings = false;




  showChangePassword: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loggedInUserName: any = '';


  showEditProfile = false;
  editFirstname = '';
  editLastname = '';
  editAddress = '';
  showMapProfile = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private config: ConfigService,
    private notificationService: NotificationService,
    private chatService: ChatService,
    private sharedStateService: SharedStateService
  ) { }

  ngOnInit(): void {
    // Pretplatite se na promene parametara za 'username'
    this.loggedInUserName = this.authService.getUserName();
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      if (this.username) {
        this.loadUserProfile(this.username);
        this.loadPosts();
      }
    });

    // Pretplatite se na promene query parametara za paginaciju
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.loadPosts();
    });
  }



  modifyPost(post: Post) {
    this.showMapProfile = false;
    const dialogRef = this.dialog.open(PostModificationComponent, {
      width: '600px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
    this.showMapProfile = true;
      if (result === true) {
        this.loadPosts(); // Reload posts after modification
      }
    });
  }

  loadUserProfile(username: string): void {
    this.userService.getUserByUsername(username).subscribe(
      (data: any) => {
        this.user = data;
        if (this.authService.getCurrentUserName() === this.user.email) {
          this.isThisMyProfile = true;
        }
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  loadPosts(): void {
    this.postService.getUserPosts(this.currentPage, this.postsPerPage, this.username).subscribe((posts: Post[]) => {
      this.posts = posts;
      this.checkNextPage();
      if (this.posts.length == 0 && this.currentPage > 0) {
        this.goToPage(0)
      }
    });
  }

  checkNextPage(): void {
    this.postService.getUserPosts(this.currentPage + 1, this.postsPerPage, this.username).subscribe((posts: Post[]) => {
      if (posts.length < 1) {
        this.canGoNext = false;
      } else {
        this.canGoNext = true;
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.updateUrl();
    this.loadPosts();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateUrl();
      this.loadPosts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateUrl();
    this.loadPosts();
  }

  updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
  }

  viewComments(post: Post): void {
    this.postService.getCommentsForPost(post.id).subscribe((data: Post) => {
      if (data.comments && data.comments.length > 0) {
        this.dialog.open(PostCommentsComponent, {
          data: { post: data }
        });
      } else {
        this.notificationService.notify({
          message: 'No comments to display',
          duration: 3000, notificationType: NotificationType.INFO
        });
      }
    });
  }

  goToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  onMouseOver(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }

  onMouseOut(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }

  getRelativeTime(date: Date): string {
    return moment(date).fromNow();
  }

  getImage(imgPath: string): string {
    const ret = `${this.config.posts_image_url}/${imgPath}`;
    return ret;
  }

  toggleLike(post: Post): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.notify({
        message: 'You must be logged in with user role to like a post.',
        duration: 3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }
    if (this.authService.getRole() !== 'AUTHENTICATED') {
      this.notificationService.notify({
        message: 'You must be logged in with user role to like a post.',
        duration: 3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }
    if (post.likedByMe) {
      this.unlikePost(post);
    } else {
      this.likePost(post);
    }
  }

  unlikePost(post: Post) {
    this.postService.unlikePost(post.id).subscribe((data: Post) => {
      // Uspešno izvršen zahtev
      post.likedByMe = !post.likedByMe;
      post.likeNumber--;
      this.notificationService.notify({
        message: 'Post unliked successfully!',
        duration: 3000, notificationType: NotificationType.SUCCESS
      });
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.notificationService.notify({
          message: 'Error unliking post. Please try again later.',
          duration: 3000, notificationType: NotificationType.ERROR
        });
      }
    );
  }

  likePost(post: Post) {
    this.postService.likePost(post.id).subscribe((data: Post) => {
      // Uspešno izvršen zahtev
      post.likedByMe = !post.likedByMe;
      post.likeNumber++;
      this.notificationService.notify({
        message: 'Post liked successfully!',
        duration: 3000, notificationType: NotificationType.SUCCESS
      });
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.notificationService.notify({
          message: 'Error liking post. Please try again later.',
          duration: 3000, notificationType: NotificationType.ERROR
        });
      }
    );
  }

  addComment(post: Post): void {

    if (!this.authService.isAuthenticated()) {
      this.notificationService.notify({
        message: 'You must be logged in to add a comment.',
        duration: 3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }

    const dialogRef = this.dialog.open(CommentFormComponent, {
      width: '50%',
      data: { postId: post.id }
    });
  }

  confirmDelete(post: Post): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '250px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deletePost(post);
      }
    });
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post.id).subscribe(
      () => {
        this.loadPosts();
        this.notificationService.notify({
          message: 'Post deleted successfully',
          duration: 3000, notificationType: NotificationType.SUCCESS
        });
        this.loadPosts(); // Reload posts after deletion
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.notificationService.notify({
          message: 'Error deleting post',
          duration: 3000, notificationType: NotificationType.ERROR
        });
      }
    );
  }

  unfollowUser(userId: number) {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.notify({
        message: 'You must be logged in to unfollow.',
        duration: 3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }

    this.userService.unfollowUser(userId).subscribe(
      () => {
        this.user.userFollowedByMe = false;
        this.user.followersCount--;
        this.notificationService.notify({
          message: 'Unfollowing successfully',
          duration: 3000, notificationType: NotificationType.SUCCESS
        });
      },
      (error) => {
        console.error('Error during unfollowing:', error);
        this.notificationService.notify({
          message: 'Error during unfollowing',
          duration: 3000, notificationType: NotificationType.ERROR
        });
      }
    );
  }

  followUser(userId: number) {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.notify({
        message: 'You must be logged in to follow.',
        duration: 3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }

    this.userService.followUser(userId).subscribe(
      () => {
        this.user.userFollowedByMe = true;
        this.user.followersCount++;
        this.notificationService.notify({
          message: 'Following successfully',
          duration: 3000, notificationType: NotificationType.SUCCESS
        });
      },
      (error) => {
        console.error('Error during following:', error);
        this.notificationService.notify({
          message: 'Error during following',
          duration: 3000, notificationType: NotificationType.ERROR
        });
      }
    );
  }

  chatWithUser(userId: number) {
    this.sharedStateService.setShowChatAndChatIdandUserId(true, -1, userId);
  }






  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  changePassword(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.notificationService.notify({ message: 'All fields are required.', duration: 3000, notificationType: NotificationType.WARNING });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.notify({ message: 'New passwords do not match.', duration: 3000, notificationType: NotificationType.WARNING });
      return;
    }

    // Call the service to change the password
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(
      () => {
        this.notificationService.notify({ message: 'Password changed successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        this.toggleChangePassword();
      },
      (error) => {
        console.error('Error changing password:', error);
        if (error.status === 400) {
          this.notificationService.notify({ message: 'Old password is incorrect.', duration: 3000, notificationType: NotificationType.ERROR });
        } else {
          this.notificationService.notify({ message: 'Password changed successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
          setTimeout(() => {
            window.location.reload(); // Osvežavanje stranice
          }, 3000);
        }
      }
    );
  }






  saveProfileChanges() {
    const updatedUser: { firstname?: string; lastname?: string; address?: string } = {};

    if (this.editFirstname && this.editFirstname !== this.user.firstname) {
      updatedUser.firstname = this.editFirstname;
    }
    if (this.editLastname && this.editLastname !== this.user.lastname) {
      updatedUser.lastname = this.editLastname;
    }
    if (this.editAddress && this.editAddress !== this.user.address) {
      updatedUser.address = this.editAddress;
    }

    this.userService.updateProfile(updatedUser).subscribe(
      () => {
        this.notificationService.notify({ message: 'Profile updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        window.location.reload(); // Osvežavanje stranice
      },
      (error) => {
        this.notificationService.notify({ message: 'Profile updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        setTimeout(() => {
          window.location.reload(); // Osvežavanje stranice
        }, 1000);
      }
    );
  }






  toggleEditProfile() {
    this.showEditProfile = !this.showEditProfile;
    // Popunite polja trenutnim vrednostima korisnika
    if (this.showEditProfile && this.user) {
      this.editFirstname = this.user.firstname;
      this.editLastname = this.user.lastname;
      this.editAddress = this.user.address;
    }
  }



  searchQuery: string = '';
  selectedLocation: { latitude: number; longitude: number } | null = null;

  onSearch(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.notificationService.notify({ message: 'Please enter a location to search.', duration: 3000, notificationType: NotificationType.INFO });
      return;
    }


    this.mapComponent?.search(this.searchQuery);
  }


  setLocation(latlng: number[]): void {
    this.selectedLocation = { latitude: latlng[0], longitude: latlng[1] };
    console.log('Selected Location:', this.selectedLocation);
  }




}










