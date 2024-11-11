import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostCreation } from '../models/posts.model';
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
        return this.http.get<Post[]>(`${this.config.posts_url}/allPaged?page=${page}&size=${size}&sort=createdAt,DESC`);
    }

    uploadImage(formData: FormData): Observable<string> {
        return this.http.post<string>(`${this.config.posts_image_url}`, formData, {responseType: 'text' as 'json'});
    }

    greet(name: string): Observable<string> {
        return this.http.post<string>(`${this.config.posts_url}/upload/string`, name, {responseType: 'text' as 'json'});
    }  

    addPost(post: PostCreation, authorId : number): Observable<Post>{
        return this.http.post<Post>(`${this.config.posts_url}/`+authorId, post);
    }
}