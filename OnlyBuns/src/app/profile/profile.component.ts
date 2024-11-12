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

  username: string = '';
  user: any;
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 3;
  canGoNext: boolean = true;
  isThisMyProfile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    // Pretplatite se na promene parametara za 'username'
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
    const dialogRef = this.dialog.open(PostModificationComponent, {
      width: '600px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
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
        this.snackBar.open('No comments to display', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar']
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
      this.snackBar.open('You must be logged in with user role to like a post.', 'Login', {
        duration: 3000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    if (this.authService.getRole() !== 'AUTHENTICATED') {
      this.snackBar.open('You must be logged in with user role to like a post.', 'Logout', {
        duration: 3000
      }).onAction().subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
      });
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
      this.snackBar.open('Post unliked successfully!', 'Close', {
        duration: 3000
      });
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.snackBar.open('Error unliking post. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    );
  }

  likePost(post: Post) {
    this.postService.likePost(post.id).subscribe((data: Post) => {
      // Uspešno izvršen zahtev
      post.likedByMe = !post.likedByMe;
      post.likeNumber++;
      this.snackBar.open('Post liked successfully!', 'Close', {
        duration: 3000
      });
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.snackBar.open('Error liking post. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    );
  }

  addComment(post: Post): void {

    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to add a comment.', 'Login', {
        duration: 3000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
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
        this.snackBar.open('Post deleted successfully', 'Close', {
          duration: 3000
        });
        this.loadPosts(); // Reload posts after deletion
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.snackBar.open('Error deleting post', 'Close', {
          duration: 3000
        });
      }
    );
  }
}
