import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from '../models/posts.model';
import { MatDialog } from '@angular/material/dialog';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { PostComment } from '../models/postComment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  postsPerPage: number = 28;

  constructor(private postService: PostService, private dialog: MatDialog, private snackBar: MatSnackBar,private router:Router) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts(this.currentPage, this.postsPerPage).subscribe((data: Post[]) => {
      this.posts = data;
      if(this.posts.length==0){
        if(this.currentPage>0){
          this.previousPage()
        }
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadPosts();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPosts();
    }
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
    post.isLikedByMe = !post.isLikedByMe;
    post.likes += post.isLikedByMe ? 1 : -1;
  }

  addComment(post: Post): void {
    // Implementirajte logiku za dodavanje komentara
    console.log('Add comment for post:', post);
  }
}
