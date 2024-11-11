import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Post } from '../models/posts.model';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { PostComment } from '../models/postComment.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    constructor(private http: HttpClient, private apiService: ApiService,
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

    getCommentsForPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.config.posts_url}/allPostComments?id=${id}`);
    }

    getPosts(page: number, size: number): Observable<Post[]> {
        const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
        });
        return this.http.get<Post[]>(`${this.config.posts_url}/allPaged?page=${page}&size=${size}&sort=createdAt,DESC`, { headers }).pipe(
            catchError(error => {
                if (error.status === 403) {
                    // Preusmeravanje na login ako je zabranjen pristup
                    this.router.navigate(['/login']);
                    alert("You must be logged as Amin")
                }
                return throwError(() => error);  // Prosleđivanje greške dalje
            })
        );
    }
}