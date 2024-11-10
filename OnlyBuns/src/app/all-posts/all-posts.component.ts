import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from '../models/posts.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {
  posts: Post[] = [];
  currentPage: number = 0;
  postsPerPage: number = 28;

  constructor(private postService: PostService) { }

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
    // Implementirajte logiku za prikaz komentara
  }

  onMouseOver(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }

  onMouseOut(post: Post): void {
    // Implementirajte logiku za hover efekat ako je potrebno
  }
}
