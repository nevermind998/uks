import { CommentDto, ReactionDto } from '../Types/action.types';
import { api } from './apiBase';

export const getCommentsForPr = async (pr: number) => {
  const repos = await api.get(`/user-actions/pull_request/${pr}/comments`);
  return repos.data;
};

export const getCommentsForIssue = async (issue: number) => {
  const repos = await api.get(`/user-actions/issue/${issue}/comments`);
  return repos.data;
};

export const addNewComment = async (body: CommentDto) => {
  const action = await api.post(`/user-actions/new-comment`, body);
  return action.data;
};

export const deleteComment = async (comment: number) => {
  const repo = await api.delete(`/user-actions/comments/${comment}`);
  return repo.data;
};

export const editComment = async (body: CommentDto, comment: number) => {
  const action = await api.put(`/user-actions/comments/${comment}`, body);
  return action.data;
};

export const getCommentReactions = async (comment: number) => {
  const repos = await api.get(`/user-actions/comment/${comment}/reactions`);
  return repos.data;
};

export const addNewReaction = async (body: ReactionDto) => {
  const action = await api.post(`/user-actions/new-reaction`, body);
  return action.data;
};
