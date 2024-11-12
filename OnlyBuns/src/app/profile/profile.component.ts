import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';  // Pretpostavka da imate UserService
import { Post } from '../models/posts.model';
import { PostService } from '../service/post.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../service';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  user: any;
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 3;
  canGoNext: boolean = true;
  

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username) {
      this.loadUserProfile(this.username);
      this.route.queryParams.subscribe(params => {
        this.currentPage = +params['page'] || 0;
        this.loadPosts();
      });
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

  loadPosts(): void {
    this.postService.getPosts(this.currentPage, this.postsPerPage).subscribe((posts: Post[]) => {
      this.posts = posts;
      this.checkNextPage();
      if (this.posts.length == 0 && this.currentPage > 0) {
        this.goToPage(0)
      }
    });
  }

  checkNextPage(): void {
    this.postService.getPosts(this.currentPage + 1, this.postsPerPage).subscribe((posts: Post[]) => {
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

  onMouseOver(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }

  onMouseOut(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }

  getRelativeTime(date: Date): string {
    return moment(date).fromNow();
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
    if (this.authService.getRole() !== 'ROLE_AUTHENTICATED') {
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

    console.log('Add comment for post:', post);
  }
  
}
