import { Tooltip } from '@components/elements';
import { PlaceDetailModal } from '@components/modules/modals/PlaceDetailModal';
import PostDetailCommentSection from '@components/modules/postDetail/Comments';
import {
  useLikeMutation,
  useUnlikeMutation,
} from '@graphql/mutations/relations.graphql';
import { PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import i18n from '@src/translation/i18n';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  HiArrowSmLeft,
  HiArrowSmRight,
  HiOutlineCalendar,
  HiOutlineHeart,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

interface PostDetailTemplateProps {
  post: PostQuery['post'];
}

const PostDetailTemplate: React.FC<PostDetailTemplateProps> = ({ post }) => {
  const { t } = useTranslation();
  const [currentPhoto, setCurrentPhoto] = useState<number>(0);
  const [localLikeState, setLocalLikeState] = useState<boolean>(post.liked);
  const likeCountWithoutMe = post.likeCount - (post.liked ? 1 : 0); // like count withou me
  const meContext = React.useContext(MeContext);
  const [placeDetailModal, setPlaceDetailModal] = useState<boolean>(false); // open place detail modal

  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  async function OnLike(id: number, type: string) {
    if (!meContext.isLoggedIn) return;
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
    if (!meContext.isLoggedIn) return;
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
    <main className="block px-2 m-auto mt-4 font-medium text-gray-900 max-w-screen-xl">
      {/* PLACE DETAIL MODAL */}
      <PlaceDetailModal
        isOpen={placeDetailModal}
        setIsOpen={setPlaceDetailModal}
        id={post.place.id}
        place={post.place}
      />

      <div className="grid grid-cols-[1fr_15rem_auto]">
        {/* ROW 1 */}
        <div className="flex items-center col-span-full gap-2 col-start-1">
          {/* CALENDAR */}
          <Link href="#" passHref>
            <Tooltip text={t('see_posts_from_this_time_period')}>
              <HiOutlineCalendar />
            </Tooltip>
          </Link>
          {/* PHOTO DATE */}
          <span>
            {post.startDay && `${post.startDay}. `}
            {post.startMonth &&
              `${new Date(0, post.startMonth, 0).toLocaleString(i18n.language, {
                month: 'long',
              })} `}
            {post.startYear}
          </span>
          {(post.startDay !== post.endDay ||
            post.startMonth !== post.endMonth ||
            post.startYear !== post.endYear) && (
            <>
              -
              <span>
                {post.endDay && `${post.endDay}. `}
                {post.endMonth &&
                  `${new Date(0, post.endMonth, 0).toLocaleString(
                    i18n.language,
                    {
                      month: 'long',
                    }
                  )} `}
                {post.endYear}
              </span>
            </>
          )}
        </div>
        {/* ROW 2 */}
        {/* MAIN SECTION */}
        {/* PHOTO */}
        <div className="relative w-full border border-gray-300 h-[80vh] shadow-sm rounded-xl col-start-1 row-span-3">
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
        {/* RIGHT PANEL */}
        {/* PLACE PHOTO */}
        <div
          className="relative w-full border border-gray-300 rounded-xl shadow-sm aspect-square col-start-2 col-span-1"
          onClick={() => setPlaceDetailModal(true)}
        >
          <Blurhash
            hash={post.place.preview!.blurhash}
            height="100%"
            width="100%"
            className="rounded-xl blurhash"
            punch={1}
          />
          <Image
            src={UrlPrefix + post.place.preview?.hash}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            alt="Image of the place"
          />
        </div>

        {/* PLACE DESCRIPTION */}
        <div className="overflow-hidden max-h-60">
          <h1>{post.place.name ?? t('place_doesnt_have_name')}</h1>

          <Link
            href={`/?lat=${post.place.latitude}&lng=${post.place.longitude}&zoom=18.5&place=${post.place.id}`}
          >
            <a className="flex items-center">
              <HiOutlineLocationMarker />
              {t('show_on_map')}
            </a>
          </Link>
          <p className="h-full pb-2 text-ellipsis">{post.place.description}</p>
        </div>

        {/* COMMENTS */}
        <div className="col-start-2 col-span-2 row-span-2">
          <PostDetailCommentSection post={post} />
        </div>

        {/* ROW 3 */}
        <div className="flex items-center justify-between w-full pt-2 col-start-1">
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
                  localLikeState
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-black'
                }`}
              />
            </motion.button>
            <span>
              {t('likes', {
                number: likeCountWithoutMe + (localLikeState ? 1 : 0),
              })}
            </span>
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
    </main>
  );
};

export default PostDetailTemplate;
