import { AddToCollectionModal } from '@components/AddToCollectionModal';
import { LoginContext } from '@components/Layout';
import hoverHandler from '@hooks/hoverHandler';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import FlipNumbers from 'react-flip-numbers';
import { toast } from 'react-hot-toast';
import { BiLike } from 'react-icons/bi';
import { FiBookmark, FiShare } from 'react-icons/fi';
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
import PostTimeline from './PostTimeline';

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-10 h-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export type PostProps = {
  author: { firstName: string; lastName: string; username: string };
  timeline?: boolean;
  photos?: Array<{ url: string }>;
  createdAt: number;
  description?: string;
  likeCount: number;
  commentCount: number;
  postDate: number;
  liked: string | null;
  refetch: () => void;
  id: number;
};

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
      // try
      try {
        // if user didn't like post before set localLikeCount + 1
        if (localLikeState === null) setLocalLikeCount(localLikeCount + 1);

        // change localLikeState
        setLocalLikeState(type);

        // call graphql mutation
        await likeMutation({ variables: { id, type } });

        // refetch if there are problems with localStates (isn't expected)
        // await refetch();
      } catch (error: any) {
        // throw error if mutation wasn't successful
        toast.error(error.message);

        // refetch data
        // (localStates will have wrong value)
        // (possibility that post was deleted)
        await refetch();
      }
    console.log(localLikeState);
  };

  const onUnlike = async () => {
    // allow only when user is logged in
    if (loginContext.data?.isLogged?.id)
      // try
      try {
        // if user liked post before set localLikeCount - 1
        if (localLikeState !== null) setLocalLikeCount(localLikeCount - 1);

        // set localLikeState to null
        setLocalLikeState(null);

        // call graphql mutation
        await unlikeMutation({ variables: { id } });

        // refetch if there are problems with localStates (isn't expected)
        // await refetch();
      } catch (error: any) {
        // throw error if mutation wasn't successful
        toast.error(error.message);

        // refetch data
        // (localStates will have wrong value)
        // (possibility that post was deleted)
        await refetch();
      }
    console.log(localLikeState);
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
          onMouseLeave={() => setReactionMenu(false)}
          className="w-full mb-4 border shadow-lg bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary sm:rounded-2xl max-w-[600px] border-light-background-tertiary"
        >
          <div className="flex items-center justify-between px-4 pt-6">
            <MiniUserCard {...author} time={createdAt} />
            <div className="flex items-center gap-2">
              <FiBookmark
                className="text-2xl"
                onClick={() => setCollectionSelectModal(true)}
              />
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
            <div className="flex justify-between w-full pb-2 opacity-70">
              <span>
                <FlipNumbers
                  height={14}
                  width={14}
                  play
                  perspective={100}
                  numbers={localLikeCount + 'likes'}
                />
              </span>
              <span>{commentCount} comments</span>
            </div>
            <div className="flex justify-around w-full py-2 text-3xl border-t border-b border-gray-300">
              <div onMouseEnter={() => setReactionMenu(true)}>
                <AnimatePresence>
                  {reactionMenu && (
                    <motion.div
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ ease: 'easeOut', duration: 0.1 }}
                      className="absolute px-4 ml-4 text-4xl bg-white border rounded-full shadow-lg -top-8  left-8 border-light-background-tertiary"
                    >
                      <Reaction text="👍" tooltip="like" onClick={onLike}>
                        <Image src={Like} height={60} width={60} alt="haha" />
                      </Reaction>
                      <Reaction text="❤" tooltip="love" onClick={onLike}>
                        <Image src={Love} height={60} width={60} alt="haha" />
                      </Reaction>
                      <Reaction text="😆" tooltip="haha" onClick={onLike}>
                        <Image src={Haha} height={60} width={60} alt="haha" />
                      </Reaction>
                      <Reaction text="😲" tooltip="wow" onClick={onLike}>
                        <Image src={Wow} height={60} width={60} alt="haha" />
                      </Reaction>
                      <Reaction text="😠" tooltip="angry" onClick={onLike}>
                        <Image src={Angry} height={60} width={60} alt="haha" />
                      </Reaction>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (localLikeState) await onUnlike();
                    else await onLike('👍');
                  }}
                >
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
                </motion.button>
              </div>
              <CommentIcon />
              <FiShare />
            </div>
          </div>
        </div>
      </PostTimeline>
    </>
  );
};

const Reaction: React.FC<{
  text: string;
  tooltip: string;
  onClick: (type: string) => void;
}> = ({ children, onClick, text, tooltip }) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <motion.button
        {...hoverHandler(setHover)}
        initial={{ y: '40px', opacity: 0.4 }}
        animate={{ y: '0', opacity: 1 }}
        exit={{ y: '40px', opacity: 0.4 }} // dissapear animation
        whileHover={{ scale: 1.4 }} // scale on hover
        transition={{ ease: 'easeOut', duration: 0.1 }}
        onClick={async () => await onClick(text)}
      >
        {/* TOOLTIP */}
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            className="absolute px-3 py-1 text-sm text-white bg-black rounded-full -top-6 left-[1.85rem] -translate-x-1/2"
          >
            {tooltip}
          </motion.div>
        )}
        {/* ICON */}
        {children}
      </motion.button>
    </>
  );
};

export default Post;
