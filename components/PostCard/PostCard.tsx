import Link from 'next/link';
import React, { FC, useState } from 'react';
import { useDeletePostMutation, usePostQuery } from '@graphql/post.graphql';
import {
  useLikeMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { FiSend } from 'react-icons/fi';
import Image from 'next/image';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Avatar, Button, Grid, Modal } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { MdPhotoCamera } from 'react-icons/md';
import { AiFillLike, AiOutlineComment, AiOutlineMore } from 'react-icons/ai';

const PostCard: FC<{
  isLoggedQuery: any;
  id: number;
  refetch: any;
}> = ({ id, isLoggedQuery, refetch }) => {
  const { data, loading, error } = usePostQuery({ variables: { id } });
  const [unfollowMutation] = useUnfollowMutation();

  const [deletePostMutation] = useDeletePostMutation();
  const [likeMutation] = useLikeMutation();
  const [modal, setModal] = useState(false);
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
      <Modal
        aria-labelledby="modal-title"
        open={modal}
        onClose={() => setModal(false)}
      >
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
            <ModalOption onClick={() => setEditMode(true)} text="Edit" />
          </>
        ) : (
          <>
            <ModalOption
              onClick={() => setModal(false)}
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
        )}
        <ModalOption onClick={() => setModal(false)} text="Share" />
        <ModalOption onClick={() => setModal(false)} text="Go to post" />
        <ModalOption onClick={() => setModal(false)} text="Copy link" />
        <ModalOption onClick={() => setModal(false)} text="Cancel" />
      </Modal>

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
