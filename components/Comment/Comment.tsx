import { Menu } from '@components/Modal';
import { useDeleteMutation } from '@graphql/post.graphql';
import {
  useLikeMutation,
  useReportMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import TimeAgo from 'react-timeago';

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

  const [mouseOverComment, setMouseOverComment] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showLikeOptions, setShowLikeOptions] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  // save comment input to ref for focus on button click
  const inputRef = useRef<HTMLInputElement>(null);

  // local like state tracking for real time changes
  const [localLikeState, setLocalLikeState] = useState<boolean | null>(null);

  const isCommentAuthor = author.id === logged?.id;

  return (
    <span
      className="flex w-full pl-3 gap-2"
      onMouseOver={() => setMouseOverComment(true)}
      onMouseLeave={() => setMouseOverComment(false)}
    >
      <div id="userProfile" className="relative w-8 h-8 rounded-full">
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
            className="p-2 bg-[#F1F2F4] rounded-2xl max-w-[210px]"
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            <strong className="font-semibold">
              {author.firstName} {author.lastName}
            </strong>
            <br />
            {content.length > 500 ? (
              <>
                {!showOptions ? (
                  <>
                    {content.substr(0, 500)}
                    <a
                      className="text-indigo-600 cursor-pointer"
                      onClick={() => setShowOptions(true)}
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
                      onClick={() => setShowOptions(false)}
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
              {mouseOverComment && (
                <DotsHorizontalIcon
                  id="options"
                  className="w-6 h-6 p-1 rounded-full hover:bg-[#F1F2F4]"
                />
              )}
            </button>
          </Menu>
        </div>

        <span className="pl-2">
          <button
            onClick={async () => {
              const likedTmp = localLikeState ?? liked;
              setLocalLikeState(!likedTmp);
              try {
                if (likedTmp)
                  await unlikeMutation({
                    variables: { id },
                  });
                else
                  await likeMutation({
                    variables: { id, type: 'like' },
                  });
                await refetch();
              } catch (error) {
                // @ts-ignore
                toast.error(error.message);
              }
            }}
          >
            {localLikeState ?? liked ? 'Unlike' : 'Like'}
          </button>{' '}
          · <button onClick={() => setShowReplyInput(true)}>Reply</button> ·{' '}
          <TimeAgo date={createdAt} />
        </span>
        <br />
        {showReplyInput && (
          <form>
            <textarea
              className="w-full p-2 ml-6 bg-gray-100 border-2 border-gray-300 rounded-xl"
              onChange={(e: any) => setCommentContent(e.target.value)}
              value={commentContent}
              // @ts-ignore
              // save comment input element to ref for focus
              ref={inputRef}
            />
          </form>
        )}
      </div>
    </span>
  );
};

export default Comment;
