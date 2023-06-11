import React, { useEffect, useState } from 'react';
import { CommentDto } from '../../Types/action.types';
import { addNewComment, getCommentsForIssue, getCommentsForPr } from '../../api/comments';
import { useQuery } from 'react-query';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import Comment from './Comment';
import { Button, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../Store/slices/auth.slice';

const CommentsDisplay = ({ obj_id, isPr, comments, refetch }: any) => {
  const user = useSelector(selectAuth);
  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState('');

  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
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

  useEffect(() => {
    refetch();
  }, [comments]);

  return (
    <div>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div style={{ maxHeight: '350px', overflow: 'auto', marginTop: '30px' }}>
        {comments?.length === 0 ? (
          <div>
            <p>No comments yet.</p>
          </div>
        ) : (
          comments?.map((comment: any) => <Comment comment={comment} refetch={refetch} key={comment.id} />)
        )}
      </div>
      <Grid container spacing={2} alignItems="flex-end" style={{ marginTop: '30px' }}>
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
