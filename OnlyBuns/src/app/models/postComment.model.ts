export class PostComment {
  id:number;
  comment:string;
  createdAt:Date;
  authorUsername:string;
  
    constructor(
      id: number,
      comment: string,
      createdAt: Date,
      authorUsername: string,
    ) {
      this.id = id;
      this.comment = comment;
      this.createdAt = createdAt;
      this.authorUsername = authorUsername;
    }

  }
export interface PostCommentCreation{
  comment:string;
}