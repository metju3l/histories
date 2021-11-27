import Image from 'next/image';
import React, { useState } from 'react';

import { MiniUserCard } from '../MiniUserCard';
import PostTimeline from './PostTimeline';

const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

export type PostProps = {
  author: { firstName: string; lastName: string; username: string };
  timeline?: boolean;
  photos?: Array<{ url: string }>;
  createdAt: number;
  description?: string;
  likeCount: number;
  commentCount: number;
  postDate: number;
  onLike: (type: string) => void;
  onUnlike: () => void;
  liked?: string;
  loginContext: any;
};

const Post: React.FC<PostProps> = ({
  author,
  timeline,
  photos,
  createdAt,
  description,
  likeCount,
  commentCount,
  postDate,
  onLike,
  onUnlike,
  liked,
  loginContext,
}) => {
  const [reactionMenu, setReactionMenu] = useState(false);
  const [collectionSelectModal, setCollectionSelectModal] = useState(false);

  return (
    <PostTimeline time={postDate} show={timeline}>
      <div
        onMouseLeave={() => setReactionMenu(false)}
        className="w-full mb-4 border shadow-lg bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary sm:rounded-2xl max-w-[600px] border-light-background-tertiary"
      >
        <div className="px-4 pt-6 flex items-center justify-between">
          <MiniUserCard {...author} time={createdAt} />
        </div>
        <p className="px-4 pt-2 font-medium">{description}</p>
        {photos && (
          <div className="relative w-full my-4 bg-white cursor-pointer dark:bg-black h-[360px] bg-secondary">
            <Image
              src={photos[0].url}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              alt="Profile picture"
            />
          </div>
        )}
        <div className={`px-4 pb-12 relative ${photos ? '' : 'pt-4 '}`}>
          <div className="flex justify-between w-full pb-2 opacity-70">
            <span>{likeCount} likes</span>
            <span>{commentCount} comments</span>
          </div>
          <div className="flex justify-around w-full py-2 border-t border-b border-gray-300">
            <button
              onMouseEnter={() => {
                setTimeout(() => {
                  setReactionMenu(true);
                }, 400);
              }}
              onClick={async () => {
                if (liked) await onUnlike();
              }}
            >
              {reactionMenu && (
                <div className="absolute top-0 px-4 py-2 ml-4 text-2xl bg-white border rounded-full shadow-lg -translate-x-1/2 border-light-background-tertiary">
                  <Reaction text="👍" onClick={onLike} />
                  <Reaction text="❤" onClick={onLike} />
                  <Reaction text="😆" onClick={onLike} />
                  <Reaction text="😢" onClick={onLike} />
                  <Reaction text="😠" onClick={onLike} />
                </div>
              )}
              {liked ?? <LikeIcon />}
            </button>
            <CommentIcon />
            <ShareIcon />
          </div>
        </div>
      </div>
    </PostTimeline>
  );
};

const Reaction: React.FC<{ text: string; onClick: (type: string) => void }> = ({
  text,
  onClick,
}) => (
  <button
    className="hover:text-4xl hover:-mt-3"
    onClick={async () => await onClick(text)}
  >
    {text}
  </button>
);

export default Post;
