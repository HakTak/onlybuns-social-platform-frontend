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
import { AuthService } from '../service';


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

  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
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
      if (this.posts.length == 0 && this.currentPage > 0) {
        this.previousPage()
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

  toggleLike(post: Post): void {

    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to like a post.', 'Login', {
        duration: 3000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    post.isLikedByMe = !post.isLikedByMe;
    post.likes += post.isLikedByMe ? 1 : -1;
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
