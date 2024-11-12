export class PostComment {
  id:number;
  comment:string;
  createdAt:Date;
  authorUsername:string;
  email:string;

    constructor(
      id: number,
      comment: string,
      createdAt: Date,
      authorUsername: string,
      email:string,
    ) {
      this.id = id;
      this.comment = comment;
      this.createdAt = createdAt;
      this.authorUsername = authorUsername;
      this.email=email;
    }

  }
export interface PostCommentCreation{
  comment:string;
}