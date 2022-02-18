import {
  useLikeMutation,
  useUnlikeMutation,
} from '@graphql/mutations/relations.graphql';
import { PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiArrowSmLeft, HiArrowSmRight, HiOutlineHeart } from 'react-icons/hi';

interface PostDetailMainSectionProps {
  post: PostQuery['post'];
}

const PostDetailMainSection: React.FC<PostDetailMainSectionProps> = ({
  post,
}) => {
  const { t } = useTranslation<string>(); // i18n
  const [currentPhoto, setCurrentPhoto] = useState<number>(0);
  const [localLikeState, setLocalLikeState] = useState<boolean>(post.liked);
  const likeCountWithoutMe = post.likeCount - (post.liked ? 1 : 0); // like count withou me
  const meContext = React.useContext(MeContext);

  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  async function OnLike(id: number, type: string) {
    // runs like mutation and changes local states
    // try
    try {
      if (localLikeState) return; // if user already liked post before return
      setLocalLikeState(true); // change localLikeState
      await likeMutation({ variables: { id, type } }); // call graphql mutation
    } catch (error: any) {
      // throw error if mutation wasn't successful
      toast.error(error.message);
      // refetch data
      // (localStates will have wrong value)
      // (possibility that post was deleted)
      // await refetch();
    }
  }

  async function OnUnlike(id: number) {
    // try
    try {
      if (!localLikeState) return; // if user didn't like post before return
      setLocalLikeState(false); // change localLikeState
      await unlikeMutation({ variables: { id } }); // call graphql mutation
    } catch (error: any) {
      // throw error if mutation wasn't successful
      toast.error(error.message);
      // refetch data
      // (localStates will have wrong value)
      // (possibility that post was deleted)
      // await refetch();
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative w-full border border-gray-300 h-[80vh] shadow-sm rounded-xl">
        <Blurhash
          hash={post.photos[currentPhoto].blurhash}
          height="100%"
          width="100%"
          className="rounded-xl blurhash"
          punch={1}
          style={{ borderRadius: '50%' }}
        />
        <Image
          src={UrlPrefix + post.photos[currentPhoto].hash}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          alt="post image"
        />
      </div>
      {/* UNDER PHOTO PANEL */}
      <div className="flex items-center justify-between w-full pt-2">
        {/* LIKES */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              // if user is not logged in
              if (meContext.data === undefined) return;
              // if post is liked, unlike
              if (localLikeState) OnUnlike(post.id);
              // if post is not liked, like
              else OnLike(post.id, 'like');
            }}
          >
            <HiOutlineHeart
              className={`w-7 h-7 ${
                localLikeState ? 'fill-red-500 stroke-red-500' : 'stroke-black'
              }`}
            />
          </motion.button>
          {likeCountWithoutMe + (localLikeState ? 1 : 0)}
        </div>
        {/* NEXT AND PREVIOUS POST */}
        <div className="flex items-center">
          {/* LEFT ARROW */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentPhoto > 0) setCurrentPhoto(currentPhoto - 1);
            }}
          >
            <HiArrowSmLeft
              className={`w-6 h-6 ${
                currentPhoto === 0 ? 'text-gray-400' : 'text-black'
              }`}
            />
          </motion.button>
          {/* POST INDEX */}
          {currentPhoto + 1} / {post.photos.length}
          {/* RIGHT ARROW */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentPhoto + 1 < post.photos.length)
                setCurrentPhoto(currentPhoto + 1);
            }}
          >
            <HiArrowSmRight
              className={`w-6 h-6 ${
                currentPhoto + 1 === post.photos.length
                  ? 'text-gray-400'
                  : 'text-black'
              }`}
            />
          </motion.button>
        </div>
        <span />
      </div>
    </div>
  );
};

export default PostDetailMainSection;
