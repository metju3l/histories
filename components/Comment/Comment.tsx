import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import React, { useState } from 'react';
import Image from 'next/image';
import TimeAgo from 'react-timeago';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { Menu } from '@components/Modal';
import { useDeleteMutation } from '@graphql/post.graphql';
import { toast } from 'react-hot-toast';
import {
  useLikeMutation,
  useReportMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';

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
  liked: boolean;
  refetch: any;
};

const Comment: React.FC<CommentProps> = ({
  content,
  id,
  liked,
  author,
  createdAt,
  logged,
  refetch,
}) => {
  const [deleteMutation] = useDeleteMutation();
  const [reportMutation] = useReportMutation();
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();
  const [mouseOver, setMouseOver] = useState(false);
  const isCommentAuthor = author.id === logged?.id;
  const [showMore, setShowMore] = useState(false);

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
            {content.length > 500 ? (
              <>
                {!showMore ? (
                  <>
                    {content.substr(0, 500)}
                    <a
                      className="text-indigo-600 cursor-pointer"
                      onClick={() => setShowMore(true)}
                    >
                      {' '}
                      continue reading...
                    </a>
                  </>
                ) : (
                  <>
                    {content}
                    <a
                      className="text-indigo-600 cursor-pointer"
                      onClick={() => setShowMore(false)}
                    >
                      {' '}
                      show less...
                    </a>
                  </>
                )}
              </>
            ) : (
              content.substr(0, 500)
            )}
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
                          await refetch();
                        } catch (error: any) {
                          toast.error(error.message);
                        }
                      },
                    },
                  ]
                : [
                    { title: 'Show profile', onClick: () => {} },
                    {
                      title: 'Report',
                      onClick: async () => {
                        try {
                          await reportMutation({ variables: { id } });
                          toast.success('Comment reported');
                        } catch (error: any) {
                          toast.error(error.message);
                        }
                      },
                    },
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
          <button
            onClick={async () => {
              try {
                if (liked)
                  await unlikeMutation({
                    variables: { id },
                  });
                else
                  await likeMutation({
                    variables: { id, type: 'like' },
                  });
                await refetch();
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
          >
            {liked ? 'Unlike' : 'Like'}
          </button>{' '}
          · Reply · <TimeAgo date={createdAt} />
        </span>
      </div>
    </span>
  );
};

export default Comment;
