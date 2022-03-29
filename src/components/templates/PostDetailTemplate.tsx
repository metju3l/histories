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
  const [placeDetailModal, setPlaceDetailModal] = useState<boolean>(false); // open place detail modal
  const [showImage, setShowImage] = useState<boolean>(false);

  return (
    <main
      className="block w-full font-medium text-gray-900"
      style={{
        height: 'calc(100vh - 56px)',
      }}
    >
      {/* PLACE DETAIL MODAL */}
      <PlaceDetailModal
        isOpen={placeDetailModal}
        setIsOpen={setPlaceDetailModal}
        id={post.place.id}
        place={post.place}
      />

      <div className="flex w-full h-full">
        <div className="relative w-full h-full">
          <Blurhash
            hash={post.photos[currentPhoto].blurhash}
            height="100%"
            width="100%"
            punch={1}
            style={{ borderRadius: '50%' }}
          />
          <Image
            src={UrlPrefix + post.photos[currentPhoto].hash}
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
            alt="photo"
          />

          {/* NSFW accept */}
          {post.nsfw &&
            (showImage ? (
              <button
                className="absolute text-black right-4 bottom-4"
                onClick={() => setShowImage(false)}
              >
                {t('hide')}
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/40">
                <div className="text-center text-white">
                  <div className="text-2xl">{t('nsfw_warning')}</div>
                  <div className="text-lg">{t('nsfw_warning_description')}</div>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 font-semibold text-white rounded-full bg-secondary"
                      onClick={() => setShowImage(true)}
                    >
                      {t('show_image')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          <div className="flex p-1 absolute top-3 right-4 bg-white rounded-xl">
            <div
              className="relative w-20 h-20 border rounded-xl shadow-sm aspect-square col-start-2 col-span-1"
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
            <div className="flex flex-col w-80 items-center py-2">
              <a className="font-semibold">{post.place.name}</a>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md">
          <PostDetailCommentSection post={post} />
        </div>
      </div>
    </main>
  );
};

export default PostDetailTemplate;
