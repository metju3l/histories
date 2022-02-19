import PostDetailMainSection from '@components/modules/postDetail/MainSection';
import PostDetailRightPanel from '@components/modules/postDetail/RightPanel';
import { PostQuery } from '@graphql/queries/post.graphql';
import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

interface PostDetailTemplateProps {
  post: PostQuery['post'];
}

const PostDetailTemplate: React.FC<PostDetailTemplateProps> = ({ post }) => {
  return (
    <main className="m-auto mt-4 max-w-screen-xl">
      {/* PHOTO DATE */}
      <h2 className="flex items-center gap-2">
        <HiOutlineCalendar />
        {post.day && `${post.day}.`}
        {post.month && `${post.month}.`}
        {post.year}
      </h2>
      <div className="flex w-full gap-2">
        {/* PHOTO */}
        <PostDetailMainSection post={post} />
        {/* RIGHT PANEL */}
        <PostDetailRightPanel post={post} />
      </div>
    </main>
  );
};

export default PostDetailTemplate;
