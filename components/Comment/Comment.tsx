import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import React, { useState } from 'react';
import Image from 'next/image';
import TimeAgo from 'react-timeago';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { Menu } from '@components/Modal';
import { useDeleteMutation } from '@graphql/post.graphql';
import { toast } from 'react-hot-toast';


type CommentProps = {
  content: string;
  createdAt: number;
  author: { firstName: string; lastName: string; id: number; username: string };
  id: number;
  logged: null | {
    email: string;
    firstName: string;
    lastName: string;
    id: number;
    username: string;
  };
  refetch: any;
};

const Comment: React.FC<CommentProps> = ({
  content,
  id,
  author,
  createdAt,
  logged,
  refetch,
}) => {
  const [deleteMutation] = useDeleteMutation();
  const [mouseOver, setMouseOver] = useState(false);
  const isCommentAuthor = author.id === logged?.id;

  return (
    <span
      className="w-full flex flex- gap-2 pl-3"
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div id="userProfile" className="relative rounded-full w-8 h-8">
        <Image
          src={GeneratedProfileUrl(author.firstName, author.lastName)}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-full"
          alt="Profile picture"
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div
            id="comment"
            className="bg-[#F1F2F4] p-2 rounded-2xl max-w-[210px]"
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            <strong className="font-semibold">
              {author.firstName} {author.lastName}
            </strong>
            <br />
            {content}
          </div>

          <Menu
            items={
              isCommentAuthor
                ? [
                    { title: 'Edit', onClick: () => {} },
                    {
                      title: 'Delete',
                      onClick: async () => {
                        try {
                          await deleteMutation({
                            variables: { id },
                          });
                        } catch (error: any) {
                          toast.error(error.message);
                        }
                        await refetch();
                      },
                    },
                  ]
                : [
                    { title: 'Show profile', onClick: () => {} },
                    { title: 'Report', onClick: () => {} },
                  ]
            }
          >
            <button className="w-6 h-6 pr-2">
              {mouseOver && (
                <DotsHorizontalIcon
                  id="options"
                  className="w-6 h-6 rounded-full hover:bg-[#F1F2F4] p-1"
                />
              )}
            </button>
          </Menu>
        </div>

        <span className="pl-2">
          Like · Reply · <TimeAgo date={createdAt} />
        </span>
      </div>
    </span>
  );
};

export default Comment;
