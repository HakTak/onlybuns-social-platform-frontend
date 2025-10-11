import { Injectable } from '@angular/core';
import { Post, PostCreation } from '../models/posts.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { PostComment } from '../models/postComment.model';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../models/notificationType.enum';
@Injectable({
    providedIn: 'root'
})
export class PostService {
    
    constructor(private http: HttpClient,
        private config: ConfigService, private router: Router,private notificationService: NotificationService) { }

    likePost(id: number) {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });

        return this.http.patch<Post>(`${this.config.posts_url}/like/${id}`, {}, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message:'You must be logged as User',duration:3000,notificationType:NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }

    unlikePost(id: number) {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });

        return this.http.patch<Post>(`${this.config.posts_url}/unlike/${id}`, {}, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message:'You must be logged as User',duration:3000,notificationType:NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }

    deletePost(id: number): Observable<any> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });

        return this.http.delete<Post>(`${this.config.posts_url}/delete/${id}`, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'Only the user who created this post can perform this action.', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
      }

    getCommentsForPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.config.posts_url}/allPostComments?id=${id}`);
    }

    getPosts(page: number, size: number,home:boolean): Observable<Post[]> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });
        return this.http.get<Post[]>(`${this.config.posts_url}/allPaged/${home}?page=${page}&size=${size}&sort=createdAt,DESC`, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'You must be logged in', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }

    getUserPosts(page: number, size: number,username:string): Observable<Post[]> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });
        return this.http.get<Post[]>(`${this.config.posts_url}/allUserPostsPaged/${username}?page=${page}&size=${size}&sort=createdAt,DESC`, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'You must be logged in', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }

    uploadImage(formData: FormData): Observable<string> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });

        return this.http.post<string>(`${this.config.posts_image_url}`, formData, { headers, responseType: 'text' as 'json' }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'You must be logged as User', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            }));
    }

    greet(name: string): Observable<string> {
        return this.http.post<string>(`${this.config.posts_url}/upload/string`, name, { responseType: 'text' as 'json' });
    }

    addPost(post: PostCreation): Observable<Post> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        console.log(token)
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });
        return this.http.post<Post>(`${this.config.posts_url}/add`, post, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'You must be logged as User', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            }));
    }

    modifyPost(postId: number, post: PostCreation): Observable<Post> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });
        return this.http.put<Post>(`${this.config.posts_url}/modify/${postId}`, post, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    this.notificationService.notify({message: 'You must be logged in', duration: 3000, notificationType: NotificationType.WARNING});
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }
    
    advertisePost(postId: number): void {
  this.http.post<void>(
    `${this.config.posts_url}/markForAdvertising/${postId}`,
    {} // telo prazno, jer backend ne očekuje telo
  ).subscribe({
    next: () => {
      this.notificationService.notify({
        message: 'You successfully advertised post!',
        duration: 5000,
        notificationType: NotificationType.SUCCESS
      });
    },
    error: (err) => {
      console.error(err);
      this.notificationService.notify({
        message: 'Failed to advertise post.',
        duration: 4000,
        notificationType: NotificationType.ERROR
      });
    }
  });
}

}