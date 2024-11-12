import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from '../models/posts.model';
import { MatDialog } from '@angular/material/dialog';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { PostComment } from '../models/postComment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService, ConfigService } from '../service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentFormComponent } from '../comment-form/comment-form.component';


@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
  animations: [
    trigger('likeAnimation', [
      state('like', style({
        transform: 'scale(1)'
      })),
      state('liked', style({
        transform: 'scale(1.2)'
      })),
      transition('like <=> liked', [
        animate('0.2s')
      ])
    ])
  ]
})
export class AllPostsComponent implements OnInit {
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 3;
  canGoNext: boolean = true;
  imagePath: string | null = null;

  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.loadPosts();
    });
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

  getImage(imgPath : string) : string{
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
      data: {postId : post.id}
    });
  }
}
