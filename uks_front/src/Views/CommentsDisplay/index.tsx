import React, { useState } from 'react';
import { CommentDto } from '../../Types/action.types';
import { addNewComment, getCommentsForIssue, getCommentsForPr } from '../../api/comments';
import { useQuery } from 'react-query';
import { ToastOptions } from '../../Components/Common/Toast';
import Comment from './Comment';
import { Button, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';

const CommentsDisplay = ({ obj_id, isPr }: any) => {
  const user = useSelector(selectAuth);
  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState('');

  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
  });

  const { data: comments, refetch } = useQuery({
    queryKey: ['FETCH_COMMENTS'],
    queryFn: async () => {
      try {
        if (isPr === false) {
          const data: CommentDto[] = await getCommentsForIssue(obj_id);
          return data;
        } else {
          const data: CommentDto[] = await getCommentsForPr(obj_id);
          return data;
        }
      } catch {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    },
  });

  const handleChange = (e: any) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    setComment('');
    try {
      if (!isPr) {
        const body: CommentDto = {
          author: user.id,
          content: comment,
          issue: obj_id,
        };
        const newComment = await addNewComment(body);
      } else {
        const body: CommentDto = {
          author: user.id,
          content: comment,
          pull_request: obj_id,
        };
        const newComment = await addNewComment(body);
      }
      refetch();
    } catch (error) {
      setToastOptions({ message: 'An error happened while commenting!', type: 'error' });
      setOpen(true);
    }
  };

  return (
    <div>
      <div style={{ height: '350px', overflow: 'auto' }}>
        {comments?.length === 0 ? (
          <div>
            <p>No comments yet.</p>
          </div>
        ) : (
          comments?.map((comment: any) => <Comment comment={comment} refetch={refetch} key={comment.id} />)
        )}
      </div>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={10}>
          <TextField label="Write a comment" value={comment} onChange={handleChange} fullWidth multiline rows={4} />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!comment.trim()}>
            Comment
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CommentsDisplay;
