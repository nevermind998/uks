import { date } from 'yup';

export type ActionDto = {
  id?: number;
  author: number;
  type: string;
  repository: number;
  forked_repo?: any;
};

export type CommentDto = {
  id?: number;
  author: any;
  created_at?: Date;
  updated_at?: Date;
  content: string;
  issue?: number;
  pull_request?: number;
};

export type ReactionDto = {
  id?: number;
  author: number;
  comment: number;
  type: string;
};
