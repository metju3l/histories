import Link from 'next/link';
import React, { FC, useState } from 'react';
import {
  useCreateCommentMutation,
  useDeleteMutation,
  usePostQuery,
} from '@graphql/post.graphql';
import {
  useLikeMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { FiSend } from 'react-icons/fi';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Avatar, Button, Grid, Input, Modal, Text } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { MdPhotoCamera } from 'react-icons/md';
import { AiFillLike, AiOutlineComment, AiOutlineMore } from 'react-icons/ai';
import { useRouter } from 'next/router';

const PostCard: FC<{
  isLoggedQuery: any;
  id: number;
}> = ({ id, isLoggedQuery }) => {
  const router = useRouter();

  const { data, loading, error, refetch } = usePostQuery({ variables: { id } });
  const [unfollowMutation] = useUnfollowMutation();

  const [deletePostMutation] = useDeleteMutation();
  const [likeMutation] = useLikeMutation();
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
  if (error) {
    console.log(error);

    return <div>error</div>;
  }

  const time = new Date(data!.post.createdAt).toLocaleDateString('cs-cz', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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
                    await deletePostMutation({
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
                    <MdPhotoCamera size={24} />
                    {postDate}
                  </a>
                </div>
              </>
            </Link>
          </a>
          <button onClick={() => setModal(true)}>
            <AiOutlineMore size={24} />
          </button>
        </div>

        <div className="relative w-full">
          <img src={data!.post.url[currentImage]} alt="Post" />
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
          <div className="flex gap-4">
            <AiFillLike size={24} />
            <AiOutlineComment size={24} />
            <FiSend size={24} />
          </div>
          <div className="p-2">
            {data?.post.description && (
              <>
                <a className="font-semibold">{data?.post.author.username}:</a>{' '}
                {data?.post.description}
              </>
            )}
            {data?.post.hashtags && data?.post.hashtags.length > 0 && (
              <div>
                <a className="font-semibold"> hashtags:</a>
                {data!.post.hashtags.map((hashtag: any) => ` ${hashtag.name} `)}
              </div>
            )}
            <div className="border-t border-gray-300 mt-2 pt-2">
              {isLoggedQuery?.data?.isLogged && (
                <>
                  <Input
                    type="text"
                    onChange={(e: any) => setCommentContent(e.target.value)}
                    value={commentContent}
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
                {data?.post.comments.map((comment: any) => (
                  <div key={comment.id}>
                    {comment.author.username}: {comment.content}
                  </div>
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
