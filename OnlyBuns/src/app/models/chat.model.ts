import { Location } from "./location.model";
import { PostComment } from "./postComment.model";
import { User } from "./user.model";

export interface Chat {
  id: number;
  type: ChatType;
  name: string;
  admin: User;
  participants: User[];
  messages: Message[];

}

export enum ChatType{
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP'
}

export interface Message {
  id: number;
  content: string;
  sender: User;
  timestamp: Date;
}