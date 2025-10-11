import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from '../models/posts.model';
import { MatDialog } from '@angular/material/dialog';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { PostComment } from '../models/postComment.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService, ConfigService } from '../service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../models/notificationType.enum';

@Component({
  selector: 'app-advertise-posts',
  templateUrl: './advertise-posts.component.html',
  styleUrls: ['./advertise-posts.component.css'],
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
export class AdvertisePostsComponent implements OnInit{
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 3;
  canGoNext: boolean = true;
  imagePath: string | null = null;
  @Input() isHomePage = false;

  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
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
    this.postService.getPosts(this.currentPage, this.postsPerPage, this.isHomePage).subscribe((posts: Post[]) => {
      this.posts = posts;
      this.checkNextPage();
      if (this.posts.length == 0 && this.currentPage > 0) {
        this.goToPage(0)
      }
    });
  }

  checkNextPage(): void {
    this.postService.getPosts(this.currentPage + 1, this.postsPerPage, this.isHomePage).subscribe((posts: Post[]) => {
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

 sendAd(postId: number): void {
  if (!this.authService.isAdmin()) {
    this.notificationService.notify({
      message: 'You must be Admin to advertise.',
      duration: 3000,
      action: 'Login',
      actionCallback: () => this.router.navigate(['/login']),
      notificationType: NotificationType.WARNING
    });
    return;
  }

  this.postService.advertisePost(postId);
}

}
