import { PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface PostDetailCommentSectionProps {
  post: PostQuery['post'];
}

const PostDetailCommentSection: React.FC<PostDetailCommentSectionProps> = ({
  post,
}) => {
  return (
    <div className="h-full p-2">
      {/* AUTHOR */}
      <div className="flex items-center gap-2">
        <Link href={`/user/${post.author.username}`} passHref>
          <div className="relative w-10 h-10 rounded-full">
            <Image
              src={
                post.author.profile.startsWith('http')
                  ? post.author.profile
                  : UrlPrefix + post.author.profile
              }
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              alt="Profile picture"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link href={`/user/${post.author.username}`}>
            <a className="text-lg font-semibold">{`${post.author.firstName} ${post.author.lastName}`}</a>
          </Link>
          <a className="text-gray-600 font-xs">
            {new Date(post.createdAt).toLocaleDateString('cs', {
              day: 'numeric',
              month: '2-digit',
              year: 'numeric',
            })}
          </a>
        </div>
      </div>
      {/* DESCRIPTION */}
      <p className="pb-2"> {post.description}</p>
      {/* COMMENTS */}
      {post.comments.map((comment, index) => {
        return (
          <div key={index} className="flex gap-2">
            <Link href={`/user/${comment?.author.username}`} passHref>
              <div className="relative w-10 h-10 rounded-full">
                <Image
                  src={
                    comment?.author?.profile.startsWith('http')
                      ? comment.author.profile
                      : UrlPrefix + comment?.author.profile
                  }
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
            </Link>
            <div className="p-2 bg-gray-200 rounded-t-lg rounded-r-lg w-fit">
              {comment?.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailCommentSection;
