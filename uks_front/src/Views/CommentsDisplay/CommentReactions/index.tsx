import { IconButton, Badge, Popover, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Favorite as FavoriteIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { ReactionDto } from '../../../Types/action.types';
import { useQuery } from 'react-query';
import { addNewReaction, deleteReaction, getCommentReactions } from '../../../api/comments';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../Store/slices/auth.slice';

const CommentReactions = ({ comment }: any) => {
  const user = useSelector(selectAuth);
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
  });
  const [hearts, setHearts] = useState<ReactionDto[]>([]);
  const [likes, setLikes] = useState<ReactionDto[]>([]);
  const [dislikes, setDislikes] = useState<ReactionDto[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['FETCH_REACTIONS'],
    queryFn: async () => {
      try {
        if (comment) {
          const data: ReactionDto[] = await getCommentReactions(comment.id);
          filterReactions(data);
          return data;
        }
      } catch {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    },
  });

  const filterReactions = (reactions: ReactionDto[]) => {
    setHearts(reactions.filter((reaction) => reaction.type === 'LOVE'));
    setLikes(reactions.filter((reaction) => reaction.type === 'LIKE'));
    setDislikes(reactions.filter((reaction) => reaction.type === 'DISLIKE'));
  };

  const handleLikeReaction = async (event: any) => {
    const like = likes.filter((like) => like.author === user.id);
    if (like.length === 0) {
      try {
        const body: ReactionDto = {
          author: user.id,
          comment: comment.id,
          type: 'LIKE',
        };
        const newReaction = await addNewReaction(body);
        refetch();
      } catch (error) {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    } else {
      try {
        if (like[0].id) {
          await deleteReaction(like[0].id);
        }
        refetch();
      } catch (error) {
        setToastOptions({ message: 'An error happened!', type: 'error' });
        setOpen(true);
      }
    }
  };

  const handleHeartReaction = async (event: any) => {
    const like = hearts.filter((like) => like.author === user.id);
    if (like.length === 0) {
      try {
        const body: ReactionDto = {
          author: user.id,
          comment: comment.id,
          type: 'LOVE',
        };
        const newReaction = await addNewReaction(body);
        refetch();
      } catch (error) {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    } else {
      try {
        if (like[0].id) {
          await deleteReaction(like[0].id);
        }
        refetch();
      } catch (error) {
        setToastOptions({ message: 'An error happened!', type: 'error' });
        setOpen(true);
      }
    }
  };

  const handleDislikeReaction = async (event: any) => {
    const like = dislikes.filter((like) => like.author === user.id);
    if (like.length === 0) {
      try {
        const body: ReactionDto = {
          author: user.id,
          comment: comment.id,
          type: 'DISLIKE',
        };
        const newReaction = await addNewReaction(body);
        refetch();
      } catch (error) {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    } else {
      try {
        if (like[0].id) {
          await deleteReaction(like[0].id);
        }
        refetch();
      } catch (error) {
        setToastOptions({ message: 'An error happened!', type: 'error' });
        setOpen(true);
      }
    }
  };

  return (
    <div>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <IconButton color="primary" onClick={handleLikeReaction}>
        <Badge badgeContent={likes.length} color="secondary">
          <ThumbUpIcon className="repository__blue" />
        </Badge>
      </IconButton>
      <IconButton color="primary" onClick={handleHeartReaction}>
        <Badge badgeContent={hearts.length} color="secondary">
          <FavoriteIcon className="repository__red" />
        </Badge>
      </IconButton>
      <IconButton color="primary" onClick={handleDislikeReaction}>
        <Badge badgeContent={dislikes.length} color="secondary">
          <ThumbDownIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

export default CommentReactions;
