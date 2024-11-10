import { PostComment } from "./postComment.model";

export class Post {
    id: number;
    description: string;
    imagePath: string;
    createdAt: Date; // LocalDateTime in Java corresponds to Date in TypeScript
    location: Location;
    authorUsername: string;
    likes: number;
    comments: PostComment[];
  
    constructor(
      id: number,
      description: string,
      imagePath: string,
      createdAt: Date,
      location: Location,
      authorUsername: string,
      likes: number
    ) {
      this.id = id;
      this.description = description;
      this.imagePath = imagePath;
      this.createdAt = createdAt;
      this.location = location;
      this.authorUsername = authorUsername;
      this.likes = likes;
      this.comments=[];
    }
  }