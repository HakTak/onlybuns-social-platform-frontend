import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/posts.model';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { PostComment } from '../models/postComment.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    getCommentsForPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.config.posts_url}/allPostComments?id=${id}`);
    }

    constructor(private http: HttpClient, private apiService: ApiService,
        private config: ConfigService) { }

    

    getPosts(page: number, size: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.config.posts_url}`);
    }
}