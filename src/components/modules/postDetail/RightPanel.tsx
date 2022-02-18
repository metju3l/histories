import { PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import PostDetailCommentSection from './Comments';

interface PostDetailRightPanelProps {
  post: PostQuery['post'];
}

const PostDetailRightPanel: React.FC<PostDetailRightPanelProps> = ({
  post,
}) => {
  const { t } = useTranslation<string>(); // i18n
  const { place } = post; // post place

  return (
    <div className="flex flex-col w-full gap-2">
      {/* PLACE */}
      <div className="gap-2 grid grid-cols-[15rem_auto]">
        {/* PHOTO */}
        <div className="relative border border-gray-300 w-60 h-60 rounded-xl shadow-sm">
          <Blurhash
            hash={place.preview!.blurhash}
            height="100%"
            width="100%"
            className="rounded-xl blurhash"
            punch={1}
            style={{ borderRadius: '50%' }}
          />
          <Image
            src={UrlPrefix + place.preview?.hash}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            alt="Image of the place"
          />
        </div>
        {/* DESCRIPTION */}
        <div className="max-h-60 overflow-hidden">
          <h1>{place.name}</h1>
          <Link
            href={`/?lat=${place.latitude}&lng=${place.longitude}&zoom=18.5&place=${place.id}`}
          >
            <a className="flex items-center">
              <HiOutlineLocationMarker />
              {t('show_on_map')}
            </a>
          </Link>
          <p className="text-ellipsis pb-2 h-full">{place.description}</p>
        </div>
      </div>
      {/* COMMENTS */}
      <PostDetailCommentSection post={post} />
    </div>
  );
};

export default PostDetailRightPanel;
