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
  author: number;
  created_at?: any;
  updated_at?: any;
  content: string;
  issue?: number;
  pull_request?: number;
};
