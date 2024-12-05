import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { PostComment, PostCommentCreation } from '../models/postComment.model';
import { NotificationService } from '../service/notification.service';
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient,
    private config: ConfigService, private router: Router,private notificationService: NotificationService) { }

    submitComment(comment : PostCommentCreation, postId : number) : Observable<PostComment>{
      const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
      });
      return this.http.post<PostComment>(`${this.config.post_comments_url}/${postId}`, comment, {headers}).pipe(
        catchError(error => {
          console.log(error)
            if (error.status === 403) {
            // Preusmeravanje na login ako je zabranjen pristup
                this.router.navigate(['/login']);
                this.notificationService.notify('You must be logged as User',3000,true);
            }
            return throwError(() => error);  // Prosleđivanje greške dalje
        }));
    }
    deleteComment(commentId: number) : Observable<PostComment>{
      const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
      });
      console.log(token)
      return this.http.delete<PostComment>(`${this.config.post_comments_url}/${commentId}`, {headers}).pipe(
        catchError(error => {
          console.log(error)
            if (error.status === 403) {
            // Preusmeravanje na login ako je zabranjen pristup
                this.router.navigate(['/login']);
                this.notificationService.notify('You must be logged as User',3000,true);
            }
            return throwError(() => error);  // Prosleđivanje greške dalje
        }));
    }
}
