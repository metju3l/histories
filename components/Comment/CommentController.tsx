import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDeleteMutation } from '../../lib/graphql/post.graphql';
import {
  useLikeMutation,
  useUnlikeMutation,
} from '../../lib/graphql/relations.graphql';
import { LoginContext } from '../Layout';
import { Comment } from '.';

// this component gets data neccesary for a comment component
const CommentHandler: React.FC<{
  content: string;
  author: { firstName: string; lastName: string; username: string; id: number };
  liked: boolean;
  createdAt: number;
  id: number;
}> = ({ content, author, liked, createdAt, id }) => {
  const loginContext = React.useContext(LoginContext);
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();
  const [deleteMutation] = useDeleteMutation();
  const [localLikeState, setLocalLikeState] = useState(liked);

  // delete comment
  const Delete = async () => {
    if (loginContext.data?.isLogged?.id === author.id) {
      try {
        await deleteMutation({
          variables: {
            id,
          },
        });
        toast.success('Comment was deleted succesfully');
      } catch (error: any) {
        toast.error(error.message);
      }
    } else toast.error('You must be owner of a comment to delete it');
  };

  // on like press
  const Like = async () => {
    if (loginContext.data?.isLogged?.id !== undefined) {
      try {
        // if already liked, unlike
        if (localLikeState) {
          setLocalLikeState(false);
          await unlikeMutation({
            variables: {
              id,
            },
          });
        }
        // if not liked, like
        else {
          setLocalLikeState(true);
          await likeMutation({
            variables: {
              id,
              type: 'like',
            },
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else toast.error('You must be logged in to like a comment');
  };

  return (
    <Comment
      author={author}
      content={content}
      createdAt={createdAt}
      owner={loginContext.data?.isLogged?.id === author.id}
      deleteComment={Delete}
      onLike={Like}
      liked={localLikeState}
      isLogged={loginContext.data?.isLogged?.id !== undefined}
    />
  );
};

export default CommentHandler;
