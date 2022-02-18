import { PostQuery } from '@graphql/queries/post.graphql';
import React from 'react';

interface PostDetailCommentSectionProps {
  post: PostQuery['post'];
}

const PostDetailCommentSection: React.FC<PostDetailCommentSectionProps> = ({
  post,
}) => {
  return <div className="p-2 h-full">{post.description}</div>;
};

export default PostDetailCommentSection;
