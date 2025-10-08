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

  viewComments(post: Post): void {
    this.postService.getCommentsForPost(post.id).subscribe((data: Post) => {
      if (data.comments && data.comments.length > 0) {
        data.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      this.notificationService.notify({message:'You must be logged in with user role to like a post.',
        duration:3000,
        action: 'Login',
        actionCallback: () => this.router.navigate(['/login']),
        notificationType: NotificationType.WARNING
      }
      );
      return;
    }
    if (this.authService.getRole() !== 'AUTHENTICATED') {
      this.notificationService.notify({message:'You must be logged in with user role to like a post.',
        duration:3000,
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
      this.notificationService.notify({message:'Post unliked successfully!',
        duration:3000,notificationType: NotificationType.SUCCESS});
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.notificationService.notify({message:'Error unliking post. Please try again later.',
          duration:3000, notificationType: NotificationType.ERROR});
      }
    );
  }

  likePost(post: Post) {
    this.postService.likePost(post.id).subscribe((data: Post) => {
      // Uspešno izvršen zahtev
      post.likedByMe = !post.likedByMe;
      post.likeNumber++;
      this.notificationService.notify({message:'Post liked successfully!',
        duration:3000,notificationType: NotificationType.SUCCESS});
    },
      (error: HttpErrorResponse) => {
        // Greška pri izvršavanju zahteva
        console.error('Error liking post:', error);
        this.notificationService.notify({message:'Error liking post. Please try again later.',
          duration:3000, notificationType: NotificationType.ERROR});
      }
    );
  }

  addComment(post: Post): void {

    if (!this.authService.isAuthenticated()) {
      this.notificationService.notify({message:'You must be logged in with user role to add a comment.',
        duration:3000,
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
}
