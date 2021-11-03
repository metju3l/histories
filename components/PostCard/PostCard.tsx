import Link from 'next/link';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  useCreateCommentMutation,
  useDeleteMutation,
  usePostQuery,
} from '@graphql/post.graphql';
import {
  useLikeMutation,
  useUnfollowMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';
import { FiSend } from 'react-icons/fi';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Avatar, Button, Modal } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { MdPhotoCamera } from 'react-icons/md';
import { AiFillLike, AiOutlineComment, AiOutlineMore } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { Comment } from '@components/Comment';
import TimeAgo from 'react-timeago';

const PostCard: FC<{
  isLoggedQuery: any;
  id: number;
}> = ({ id, isLoggedQuery }) => {
  const router = useRouter();

  const { data, loading, error, refetch } = usePostQuery({ variables: { id } });
  const [unfollowMutation] = useUnfollowMutation();

  const [deleteMutation] = useDeleteMutation();
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  // local like state tracking for real time changes
  const [localLikeState, setLocalLikeState] = useState<boolean | null>(null);
  // save comment input to ref for focus on button click
  const inputRef = useRef<HTMLInputElement>(null);

  const [createCommentMutation] = useCreateCommentMutation();
  const [commentContent, setCommentContent] = useState('');

  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState('main');
  const modalProps = {
    open: modal,
    onClose: () => {
      setModal(false);
      setModalScreen('main');
    },
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [editMode, setEditMode] = useState(false);

  if (loading) return <div>loading</div>;
  if (error || data?.post.liked === undefined) {
    console.log(error);

    return <div>error</div>;
  }

  const postDate = new Date(data!.post.postDate).toLocaleDateString('cs-cz', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      {modalScreen === 'main' ? (
        <Modal {...modalProps} aria-labelledby="modal-title">
          {isLoggedQuery?.data?.isLogged?.id === data!.post.author.id ? (
            <>
              <ModalOption
                onClick={async () => {
                  try {
                    await deleteMutation({
                      variables: { id },
                    });
                  } catch (error) {
                    // @ts-ignore
                    toast.error(error.message);
                  }
                }}
                text="Delete post"
                warning
              />
              <ModalOption
                onClick={() => {
                  setEditMode(true);
                  setModalScreen('report');
                }}
                text="Edit"
              />
            </>
          ) : (
            isLoggedQuery?.data?.isLogged?.id && (
              <>
                <ModalOption
                  onClick={() => setModalScreen('report')}
                  text="Report"
                  warning
                />

                <ModalOption
                  onClick={async () => {
                    try {
                      await unfollowMutation({
                        variables: { userID: data!.post.author.id },
                      });
                    } catch (error) {
                      // @ts-ignore
                      toast.error(error.message);
                    }
                  }}
                  text="Unfollow"
                  warning
                />
              </>
            )
          )}
          <ModalOption onClick={() => setModal(false)} text="Share" />
          <ModalOption
            onClick={() =>
              router.push(`https://www.histories.cc/post/${data?.post.id}`)
            }
            text="Go to post"
          />
          <ModalOption
            onClick={async () => {
              await navigator.clipboard.writeText(
                `https://www.histories.cc/post/${data?.post.id}`
              );
              modalProps.onClose();
            }}
            text="Copy link"
          />
          <ModalOption onClick={() => setModal(false)} text="Cancel" />
        </Modal>
      ) : modalScreen === 'report' ? (
        <Modal aria-labelledby="modal-title" {...modalProps}>
          <div className="w-full py-4 relative border-b border-[#DADBDA]">
            <a className="text-center">Report</a>
            <button
              className="absolute top-1 right-4 text-3xl font-semibold"
              onClick={modalProps.onClose}
            >
              x
            </button>
          </div>
          <ModalOption onClick={() => setModal(false)} text="Reason 1" />
          <ModalOption onClick={() => setModal(false)} text="Reason 2" />
          <ModalOption onClick={() => setModal(false)} text="Reason 3" />
          <ModalOption onClick={() => setModal(false)} text="Reason 4" />
        </Modal>
      ) : (
        <></>
      )}

      <div className="w-full m-auto bg-white dark:bg-[#343233] border-gray-[#DADBDA] border rounded-lg text-text-light dark:text-white mb-8">
        <div className="w-full flex space-between p-[1em]">
          <a className="w-full gap-[10px] h-18 flex items-center">
            <Link href={`/${data!.post.author.username}`}>
              <>
                <Avatar
                  size="medium"
                  src={GeneratedProfileUrl(
                    data!.post.author.firstName,
                    data!.post.author.lastName
                  )}
                />
                <div>
                  <a className="font-semibold text-lg">
                    {data!.post.author.firstName} {data!.post.author.lastName}
                  </a>
                  <a className="flex gap-[10px]">
                    <TimeAgo date={data.post.createdAt} />
                  </a>
                </div>
              </>
            </Link>
          </a>
          <button onClick={() => setModal(true)}>
            <AiOutlineMore size={24} />
          </button>
        </div>

        <div className="w-full">
          <p className="p-3">
            {data.post.description}
            <a className="flex gap-[10px] mt-2">
              <MdPhotoCamera size={24} />
              {postDate}
            </a>
          </p>
          <img src={data.post.url[currentImage]} alt="Post" />
          {currentImage > 0 && (
            <button onClick={() => setCurrentImage(currentImage - 1)}>
              {'<'}
            </button>
          )}
          {currentImage < data!.post.url.length - 1 && (
            <button onClick={() => setCurrentImage(currentImage + 1)}>
              {'>'}
            </button>
          )}
          <div className="pt-2 pl-4">
            <a className="font-semibold">{data.post.likes.length}</a>{' '}
            {data.post.likes.length === 1 ? 'like' : 'likes'}
          </div>
          <div className="flex py-1 px-2 w-full justify-around">
            <div
              onClick={async () => {
                const likedTmp = localLikeState ?? data.post.liked;
                setLocalLikeState(!likedTmp);
                try {
                  if (likedTmp)
                    await unlikeMutation({
                      variables: { id: data.post.id },
                    });
                  else
                    await likeMutation({
                      variables: { id: data.post.id, type: 'like' },
                    });
                  await refetch();
                } catch (error) {
                  // @ts-ignore
                  toast.error(error.message);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={localLikeState ?? data.post.liked ? '#FF0000' : '#000'}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <AiOutlineComment
              size={24}
              // @ts-ignore
              // on click focus to comment input
              onClick={() => inputRef.current.focus()}
            />
            <FiSend size={24} />
          </div>

          <div className="p-2">
            {data.post.hashtags && data.post.hashtags.length > 0 && (
              <div>
                <a className="font-semibold"> hashtags:</a>
                {data!.post.hashtags.map((hashtag: any) => ` ${hashtag.name} `)}
              </div>
            )}
            <div className="border-t border-gray-300 mt-2 pt-2">
              {isLoggedQuery?.data?.isLogged && (
                <>
                  <textarea
                    className="border-2 border-gray-300 rounded-xl bg-gray-100 p-2"
                    onChange={(e: any) => setCommentContent(e.target.value)}
                    value={commentContent}
                    // @ts-ignore
                    // save comment input element to ref for focus
                    ref={inputRef}
                  />
                  <Button
                    onClick={async () => {
                      try {
                        await createCommentMutation({
                          variables: { target: id, content: commentContent },
                        });
                        setCommentContent('');
                        await refetch();
                      } catch (error: any) {
                        toast.error(error.message);
                      }
                    }}
                  >
                    Comment
                  </Button>
                </>
              )}
              <div>
                comments:
                {data.post.comments.map((comment: any) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    refetch={refetch}
                    author={comment.author}
                    logged={isLoggedQuery?.data?.isLogged}
                    liked={comment.liked}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ModalOption = ({
  text,
  onClick,
  warning,
}: {
  text: string;
  onClick: () => void;
  warning?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`${
        warning ? 'text-red-500 font-semibold' : ''
      } w-full border-b border-gray-[#DADBDA] py-4`}
    >
      {loading ? 'loading...' : text}
    </button>
  );
};

export default PostCard;
