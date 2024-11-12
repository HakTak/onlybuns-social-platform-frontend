import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from '../service/comment.service';  // Adjust the path to your service
import { PostCommentCreation } from '../models/postComment.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentFormComponent>,
    private commentService: CommentService,  // Adjust the service if needed
    @Inject(MAT_DIALOG_DATA) public data: any  // Optional: pass data (e.g., post ID) to the dialog
  ) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],  // Initialize form control with validation
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const formValue = this.commentForm.value;
      
      let commentCreation : PostCommentCreation = {
        comment: formValue.comment
      }

      // Call your service to submit the comment
      this.commentService.submitComment(commentCreation, this.data.postId).subscribe({
        next: (response) => {
          console.log('Comment submitted successfully:', response);
          this.dialogRef.close();  // Close the dialog
        },
        error: (error) => {
          console.error('Error submitting comment:', error);
        }
      });
    }
  }
}
