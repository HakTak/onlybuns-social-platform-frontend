import { Injectable } from '@angular/core';
import { Post, PostCreation } from '../models/posts.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { PostComment } from '../models/postComment.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    
    constructor(private http: HttpClient,
        private config: ConfigService, private router: Router) { }

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
                    alert("You must be logged as user")
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
                    alert("You must be logged as user")
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
                    alert("Only the user who created this post can perform this action.")
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
                    alert("You must be logged in")
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
                    alert("You must be logged in")
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
                    alert("You must be logged as User")
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
                    alert("You must be logged as User")
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
                    alert("You must be logged in");
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }
}