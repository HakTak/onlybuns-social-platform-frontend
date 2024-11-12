import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from '../models/posts.model';
import { AuthService } from '../service';
import { CommentService } from '../service/comment.service';
import { PostComment } from '../models/postComment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent {
  post : Post | undefined
  constructor(
    public authService:AuthService,
    private router:Router,
    private commentService : CommentService,
    public dialogRef: MatDialogRef<PostCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post }
  ) {
    this.post = data.post
  }

  isUsers(comment : PostComment) : boolean{
    // console.log(this.authService.getCurrentUserName() + " == " + comment.authorUsername) iz nekog razloga getcurrentUSerName je email a getAuthorUsername je username
    return this.authService.getCurrentUserName() == comment.email;
  }

  close(): void {
    this.dialogRef.close();
  }
  delete(commentId : number):void{
    console.log(commentId)
    const comment = this.commentService.deleteComment(commentId).subscribe({
      next: (response) => {
        if(this.post != undefined){
          const index = this.post.comments.findIndex(c => c.id == commentId)
          this.post.comments.splice(index, 1)
        }
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
      }
    });
  }

  goToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
    this.dialogRef.close();
  }


}
