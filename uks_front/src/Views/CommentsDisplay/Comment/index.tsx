import { styled } from '@mui/system';
import { Avatar, Box, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastOptions } from '../../../Components/Common/Toast';
import { deleteComment, editComment } from '../../../api/comments';

const Comment = ({ comment, refetch }: any) => {
  const CommentContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(comment.content);
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
  });

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      refetch();
    } catch (error) {
      setToastOptions({ message: 'An error happened while deleting comment!', type: 'error' });
      setOpen(true);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      comment.content = updatedComment;
      await editComment(comment.id, comment);
      refetch();
    } catch (error) {
      setToastOptions({ message: 'An error happened while editing!', type: 'error' });
      setOpen(true);
    }
  };

  const handleChange = (e: any) => {
    setUpdatedComment(e.target.value);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <CommentContainer elevation={1}>
      {isEditing ? (
        <div>
          <form onSubmit={handleSave}>
            <TextField name="content" value={updatedComment} onChange={handleChange} fullWidth multiline rows={2} />
            <IconButton type="submit">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </form>
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Avatar />
              <Typography variant="subtitle1" fontWeight="bold" marginLeft={1}>
                {comment.author}
              </Typography>
              <Typography variant="body1">:{comment.content}</Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </CommentContainer>
  );
};

export default Comment;
