import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from '../models/posts.model';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent {
  constructor(
    public dialogRef: MatDialogRef<PostCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
