import { AddToCollectionModal } from '@components/AddToCollectionModal';
import { Button } from '@components/Button';
import { CommentHandler } from '@components/Comment';
import { LoginContext } from '@components/Layout/Layout';
import {
  useCreateCommentMutation,
  useDeleteMutation,
  usePostQuery,
} from '@graphql/post.graphql';
import {
  useAddToCollectionMutation,
  useLikeMutation,
  useRemoveFromCollectionMutation,
  useReportMutation,
  useUnfollowMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';
import { Menu, Transition } from '@headlessui/react';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineComment, AiOutlineMore } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import TimeAgo from 'react-timeago';

const PostCard: FC<{
  id: number;
  currentCollection?: number;
}> = ({ id, currentCollection }) => {
  const loginContext = React.useContext(LoginContext);

  const { data, loading, error, refetch } = usePostQuery({ variables: { id } });

  const [reportMutation] = useReportMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [deleteMutation] = useDeleteMutation();
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();

  const [collectionSelectModal, setCollectionSelectModal] = useState(false);

  // local like state tracking for real time changes
  const [localLikeState, setLocalLikeState] = useState<boolean | null>(null);
  // save comment input to ref for focus on button click
  const inputRef = useRef<HTMLInputElement>(null);

  const [createCommentMutation] = useCreateCommentMutation();
  const [commentContent, setCommentContent] = useState('');
  const [addToCollection] = useAddToCollectionMutation();
  const [currentImage, setCurrentImage] = useState(0);

  if (loading || loginContext.loading) return <div>loading</div>;
  if (
    error ||
    data?.post.liked === undefined ||
    loginContext.error ||
    !loginContext.data
  ) {
    console.log(error);

    return <div>{JSON.stringify(error)}</div>;
  }

  const postDateMonth = new Date(data!.post.postDate).toLocaleDateString(
    'en-us',
    {
      month: 'short',
    }
  );
  const postDateDay = new Date(data!.post.postDate).toLocaleDateString(
    'en-us',
    {
      day: '2-digit',
    }
  );
  const postDateYear = new Date(data!.post.postDate).toLocaleDateString(
    'en-us',
    {
      year: 'numeric',
    }
  );

  const DeletePost = async () => {
    try {
      await deleteMutation({
        variables: { id },
      });
      toast.success('Post deleted successfully');
    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center w-full pl-16 border-l border-gray-500 border-dashed">
      <div className="flex items-center w-28 ml-[-4.5em] text-primary">
        <div className="w-4 h-4 mr-2 border-2 border-gray-500 rounded-full bg-primary" />
        {postDateDay}. {postDateMonth}.
        <br />
        {postDateYear}
      </div>

      <div className="w-full m-auto mb-8 rounded-lg bg-primary text-primary">
        <div className="flex w-full space-between p-[1em]">
          <a className="flex items-center w-full gap-[10px] h-18">
            <Link href={`/${data!.post.author.username}`}>
              <a className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full shadow-md bg-secondary">
                  <Image
                    src={GeneratedProfileUrl(
                      data!.post.author.firstName,
                      data!.post.author.lastName
                    )}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    className="rounded-full"
                    alt="Profile picture"
                  />
                </div>
                <div>
                  <a className="text-lg font-semibold">
                    {data!.post.author.firstName} {data!.post.author.lastName}
                  </a>
                  <a className="flex gap-[10px]">
                    <TimeAgo date={data.post.createdAt} />
                  </a>
                </div>
              </a>
            </Link>
          </a>
          {loginContext?.data.isLogged?.id && (
            <div
              className="pt-2"
              onClick={() => setCollectionSelectModal(true)}
            >
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          )}
          {loginContext?.data.isLogged?.id && (
            <AddToCollectionModal
              isOpen={collectionSelectModal}
              setOpenState={setCollectionSelectModal}
              postId={data.post.id}
              addToCollection={({ collectionId }: { collectionId: number }) => {
                addToCollection({
                  variables: { postId: id, collectionId },
                });
              }}
              userCollections={
                loginContext.data.isLogged.collections?.map((collection) => ({
                  name: collection!.name,
                  id: collection!.id,
                })) ?? []
              }
            />
          )}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-whiterounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <AiOutlineMore size={24} />
              </Menu.Button>
            </div>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 bg-white shadow-lg origin-top-right divide-y divide-gray-100 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {loginContext.data.isLogged?.id === data!.post.author.id && (
                    <Menu.Item>
                      <button className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md">
                        Edit
                      </button>
                    </Menu.Item>
                  )}
                  {loginContext.data.isLogged?.id === data!.post.author.id &&
                    currentCollection !== undefined && (
                      <Menu.Item>
                        <button
                          className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md"
                          onClick={async () => {
                            try {
                              await removeFromCollection({
                                variables: {
                                  collectionId: currentCollection,
                                  postId: id,
                                },
                              });
                              toast.success('Post was removed from collection');
                            } catch (error: any) {
                              toast.error(error.message);
                            }
                          }}
                        >
                          Remove from collection
                        </button>
                      </Menu.Item>
                    )}
                  {loginContext?.data.isLogged?.id &&
                    loginContext?.data.isLogged?.id !==
                      data!.post.author.id && (
                      <>
                        <Menu.Item>
                          <button
                            className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md"
                            onClick={async () => {
                              try {
                                await reportMutation({
                                  variables: { id: data!.post.id },
                                });
                                toast.success('Post reported');
                              } catch (error) {
                                // @ts-ignore
                                toast.error(error.message);
                              }
                            }}
                          >
                            Report
                          </button>
                        </Menu.Item>

                        <Menu.Item>
                          <button
                            className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md"
                            onClick={async () => {
                              try {
                                await unfollowMutation({
                                  variables: { userID: data!.post.author.id },
                                });
                                toast.success('User unfollowed');
                              } catch (error) {
                                // @ts-ignore
                                toast.error(error.message);
                              }
                            }}
                          >
                            Unfollow
                          </button>
                        </Menu.Item>
                      </>
                    )}
                  <Menu.Item>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `https://www.histories.cc/post/${data?.post.id}`
                        );
                        toast.success('Link copied to clipboard');
                      }}
                    >
                      Copy link
                    </button>
                  </Menu.Item>
                </div>

                {loginContext?.data.isLogged?.id === data!.post.author.id && (
                  <div className="px-1 py-1">
                    <Menu.Item>
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-black group rounded-md"
                        onClick={DeletePost}
                      >
                        Delete post
                      </button>
                    </Menu.Item>
                  </div>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="w-full">
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
          <div className="flex justify-between w-full py-1 mt-4 px-[10%]">
            <div
              className="flex"
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
                className="w-6 h-6"
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
              <span className="flex pl-2">
                <a className="pr-1 font-semibold">{data.post.likes.length}</a>{' '}
                {data.post.likes.length === 1 ? 'like' : 'likes'}
              </span>
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
            <div className="pt-2 mt-2 border-t border-gray-300">
              {loginContext?.data.isLogged?.id && (
                <>
                  <textarea
                    className="p-2 bg-gray-100 border-2 border-gray-300 rounded-xl"
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
                    isLoading={false}
                  >
                    Comment
                  </Button>
                </>
              )}
              <div>
                comments:
                {data.post.comments.map((comment: any) => (
                  <div key={comment.id}>
                    {JSON.stringify(comment)}
                    <CommentHandler
                      key={comment.id}
                      {...comment}
                      author={comment.author}
                      liked={comment.liked}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
