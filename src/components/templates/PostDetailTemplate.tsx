import PostDetailMainSection from '@components/modules/postDetail/MainSection';
import PostDetailRightPanel from '@components/modules/postDetail/RightPanel';
import { PostQuery } from '@graphql/queries/post.graphql';
import i18n from '@src/translation/i18n';
import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

interface PostDetailTemplateProps {
  post: PostQuery['post'];
}

const PostDetailTemplate: React.FC<PostDetailTemplateProps> = ({ post }) => {
  return (
    <main className="m-auto mt-4 px-2 max-w-screen-xl">
      {/* PHOTO DATE */}
      <h2 className="flex items-center gap-2">
        <HiOutlineCalendar />
        <span>
          {post.startDay && `${post.startDay}. `}
          {post.startMonth &&
            `${new Date(0, post.startMonth, 0).toLocaleString(i18n.language, {
              month: 'long',
            })} `}
          {post.startYear}
        </span>
        {(post.startDay !== post.endDay ||
          post.startMonth !== post.endMonth ||
          post.startYear !== post.endYear) && (
          <>
            -
            <span>
              {post.endDay && `${post.endDay}. `}
              {post.endMonth &&
                `${new Date(0, post.endMonth, 0).toLocaleString(i18n.language, {
                  month: 'long',
                })} `}
              {post.endYear}
            </span>
          </>
        )}
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
