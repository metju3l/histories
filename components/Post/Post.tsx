import { LoginContext } from '@components/Layout';
import { ChatAltIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { BiLike } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';
import { IoIosMore } from 'react-icons/io';

import {
  useLikeMutation,
  useUnlikeMutation,
} from '../../lib/graphql/relations.graphql';
import Angry from '../../public/reactions/angry.gif';
import Haha from '../../public/reactions/haha.gif';
import Like from '../../public/reactions/like.gif';
import Love from '../../public/reactions/love.gif';
import Wow from '../../public/reactions/wow.gif';
import { MiniUserCard } from '../MiniUserCard';
import {
  AddToCollectionModal,
  LikePost,
  PostProps,
  PostTimeline,
  UnlikePost,
} from '.';
import { ReactionMenu } from './Reactions';

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

  // reaction modal state
  const [reactionMenu, setReactionMenu] = useState(false);
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
    if (loginContext.data?.isLogged?.id)
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
    if (loginContext.data?.isLogged?.id)
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
            setReactionMenu(false);
          }}
          className="w-full mb-4 border shadow-lg bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary sm:rounded-2xl max-w-[600px] border-light-background-tertiary"
        >
          <div className="flex items-center justify-between px-4 pt-6">
            <MiniUserCard {...author} time={createdAt} />
            <div className="flex items-center gap-2">
              <IoIosMore className="text-2xl" />
            </div>
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
            <div className="flex items-center justify-around w-full pt-1 border-t border-b border-gray-300">
              <div
                onMouseEnter={() => {
                  timer = setTimeout(() => setReactionMenu(true), 500);
                }}
              >
                <AnimatePresence>
                  {reactionMenu && <ReactionMenu onLike={onLike} />}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (localLikeState) await onUnlike();
                    else await onLike('👍');
                  }}
                >
                  <a className="flex items-center text-base gap-1">
                    {localLikeState ? (
                      <Image
                        src={
                          localLikeState == '👍'
                            ? Like
                            : localLikeState == '❤'
                            ? Love
                            : localLikeState == '😆'
                            ? Haha
                            : localLikeState == '😲'
                            ? Wow
                            : Angry
                        }
                        height={40}
                        width={40}
                        alt="haha"
                      />
                    ) : (
                      <BiLike />
                    )}
                    {localLikeCount} likes
                  </a>
                </motion.button>
              </div>
              <a className="flex items-center text-base gap-2">
                <ChatAltIcon className="w-6 h-6" />
                {commentCount} comments
              </a>
              <FiBookmark
                className="text-2xl"
                onClick={() => setCollectionSelectModal(true)}
              />
            </div>
          </div>
        </div>
      </PostTimeline>
    </>
  );
};

export default Post;
