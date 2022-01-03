import { LoginContext } from '@components/Layouts';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { IoIosMore } from 'react-icons/io';
import UrlPrefix from 'shared/config/UrlPrefix';

import {
  useLikeMutation,
  useUnlikeMutation,
} from '../../../lib/graphql/relations.graphql';
import { MiniUserCard } from '../tmp/MiniUserCard';
import {
  AddToCollectionModal,
  LikePost,
  PostProps,
  PostTimeline,
  UnlikePost,
} from '.';
import OptionsMenu from './OptionsMenu';

const Post: React.FC<PostProps> = ({
  author,
  timeline,
  photos,
  createdAt,
  description,
  likeCount,
  commentCount,
  postDate,
  liked,
  id,
  refetch,
}) => {
  const loginContext = useContext(LoginContext);

  const [collectionSelectModal, setCollectionSelectModal] = useState(false);

  // using local states to avoid refetching and provide faster response for user
  const [localLikeState, setLocalLikeState] = useState<string | null>(liked);
  const [localLikeCount, setLocalLikeCount] = useState<number>(likeCount);

  // like and unlike mutations
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  let timer: any;

  // on refetch reset local states to value from graphql query
  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

  useEffect(() => {
    setLocalLikeState(liked);
  }, [liked]);

  const onLike = async (type: string) => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs like mutation and changes local states
      await LikePost({
        type,
        localLikeCount,
        localLikeState,
        id,
        likeMutation,
        refetch,
        setLocalLikeCount,
        setLocalLikeState,
      });
  };

  const onUnlike = async () => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs unlike mutation and changes local states
      await UnlikePost({
        localLikeCount,
        localLikeState,
        id,
        unlikeMutation,
        refetch,
        setLocalLikeCount,
        setLocalLikeState,
      });
  };

  return (
    <>
      <AddToCollectionModal
        isOpen={collectionSelectModal}
        postId={id}
        setOpenState={setCollectionSelectModal}
      />
      <PostTimeline time={postDate} show={timeline}>
        <div
          onMouseLeave={() => {
            clearTimeout(timer);
          }}
          className="w-full mb-4 bg-white border sm:rounded-2xl max-w-[600px]"
        >
          <div className="flex items-center justify-between px-4 pt-6">
            <MiniUserCard {...author} time={createdAt} />
            <OptionsMenu id={id}>
              <IoIosMore className="text-2xl" />
            </OptionsMenu>
          </div>
          <p className="px-4 pt-2 font-medium">{description}</p>
          {photos && (
            <div className="relative w-full bg-white cursor-pointer dark:bg-black h-[360px] bg-secondary">
              <Image
                src={UrlPrefix + photos[0].url}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                alt="Profile picture"
              />
            </div>
          )}
          <div className={`px-4 relative ${photos ? '' : 'pt-4 '}`}>
            <div className="flex items-center justify-around w-full pt-1 pb-2 border-t border-gray-300">
              <div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (localLikeState) await onUnlike();
                    else await onLike('like');
                  }}
                >
                  <a className="flex items-center text-base gap-1">
                    {localLikeState ? (
                      localLikeState == 'like' ? (
                        <span>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="star"
                            className="w-4 h-4 text-yellow-500"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                          >
                            <path
                              fill="currentColor"
                              d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                            ></path>
                          </svg>
                        </span>
                      ) : (
                        localLikeState
                      )
                    ) : (
                      <span>
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="star"
                          className="w-4 h-4"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path
                            fill="currentColor"
                            d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"
                          ></path>
                        </svg>
                      </span>
                    )}
                    {localLikeCount} stars
                  </a>
                </motion.button>
              </div>
              <div className="flex items-center text-base gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="comment-alt"
                    className="w-4 h-4"
                    role="img"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"
                    />
                  </svg>
                </span>
                <span>{`${commentCount} comments`} </span>
              </div>
              <div className="flex items-center text-base gap-2">
                <span onClick={() => setCollectionSelectModal(true)}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="bookmark"
                    className="w-4 h-4"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </PostTimeline>
    </>
  );
};

export default Post;
