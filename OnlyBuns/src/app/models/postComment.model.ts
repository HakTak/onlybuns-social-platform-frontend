export class PostComment {
  id:number;
  comment:string;
  createdAt:Date;
  authorUsername:string;
  authorEmail:string;

    constructor(
      id: number,
      comment: string,
      createdAt: Date,
      authorUsername: string,
      authorEmail:string,
    ) {
      this.id = id;
      this.comment = comment;
      this.createdAt = createdAt;
      this.authorUsername = authorUsername;
      this.authorEmail=authorEmail;
    }

  }
export interface PostCommentCreation{
  comment:string;
}