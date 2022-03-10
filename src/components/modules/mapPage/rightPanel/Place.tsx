import { Loading } from '@components/elements';
import EditPlaceModal from '@components/modules/modals/EditPlaceModal';
import { useMapSidebarPlaceQuery } from '@graphql/queries/place.graphql';
import { useMapSidebarPostsQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronUp,
  HiOutlineLightningBolt,
  HiOutlineLocationMarker,
  HiOutlinePlusCircle,
  HiOutlineShare,
  HiOutlineStar,
} from 'react-icons/hi';

interface PlaceProps {
  id: number;
}

const Place: React.FC<PlaceProps> = ({ id }) => {
  const mapContext = React.useContext(MapContext); // get map context
  const meContext = React.useContext(MeContext); // get me context
  const { t } = useTranslation<string>();
  const placeQuery = useMapSidebarPlaceQuery({
    variables: { id },
  }); // get place data
  const postsQuery = useMapSidebarPostsQuery({
    variables: { input: { filter: { placeId: id } } },
  }); // get place posts
  const [isOpenEditPlaceModal, setOpenEditPlaceModal] =
    useState<boolean>(false);

  return (
    <>
      <EditPlaceModal
        isOpen={isOpenEditPlaceModal}
        setIsOpen={setOpenEditPlaceModal}
        name={placeQuery.data?.place.name}
        description={placeQuery.data?.place.description}
        id={id}
        refetch={async () => await placeQuery.refetch()}
      />

      <div className="relative w-full">
        <button
          className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2"
          onClick={() => mapContext.setSidebarPlace(null)}
        >
          <HiOutlineChevronLeft /> Show all places
        </button>
        <div className="pt-2">
          <div className="relative w-full rounded-lg cursor-pointer h-52 md:h-72 bg-secondary">
            {!placeQuery.loading && (
              <Image
                src={UrlPrefix + placeQuery.data?.place.preview?.hash}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="bg-gray-100 rounded-lg"
                alt="Place picture"
              />
            )}

            <div className="absolute bottom-0 left-0 z-20 w-full h-full text-left rounded-lg bg-gradient-to-t from-[#000000ee] via-transparent to-transparent">
              <h1 className="absolute text-white bottom-3 left-3">
                {placeQuery.data?.place.name ?? 'Place detail'}
              </h1>
            </div>
            {meContext.me?.isAdmin && (
              <button
                onClick={() => setOpenEditPlaceModal(true)}
                className="absolute z-30 px-2 py-1 font-semibold text-gray-200 border rounded top-2 right-2 backdrop-blur-sm bg-white/30 border-gray-300/30 hover:bg-white/40"
              >
                {t('edit_place')}
              </button>
            )}
          </div>
          <div className="flex justify-center py-2 gap-2">
            <button
              className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2"
              onClick={() => {
                if (!placeQuery.data) return;
                mapContext.setViewport({
                  ...mapContext.viewport,
                  latitude: placeQuery.data?.place.latitude,
                  longitude: placeQuery.data?.place.longitude,
                  zoom: 19,
                });
              }}
            >
              <HiOutlineLocationMarker /> Show on map
            </button>
            <button
              className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://www.histories.cc/?lat=${placeQuery.data?.place.latitude}&lng=${placeQuery.data?.place.longitude}&zoom=19&place=${mapContext.sidebarPlace}`
                );
                toast.success(t('link_copied'));
              }}
            >
              <HiOutlineShare /> Share
            </button>
            {meContext.data?.me && (
              <>
                <Link
                  href={`/create/post?placeID=${mapContext.sidebarPlace}`}
                  passHref
                >
                  <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                    <HiOutlinePlusCircle />
                    Add photo
                  </button>
                </Link>
                <Link
                  href={`/create/post?place=${mapContext.sidebarPlace}`}
                  passHref
                >
                  <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                    <HiOutlineStar />
                    Add to favorites
                  </button>
                </Link>
              </>
            )}
          </div>
          {/* DESCRIPTION */}
          <div className="px-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="pt-1 pb-4">{placeQuery.data?.place.description}</p>
          </div>
          <div className="w-full border-b border-gray-200 dark:border-gray-800" />
          <div className="px-4">
            <h3 className="py-4 text-lg font-semibold">Photos</h3>
            <div className="flex items-center pb-4 gap-2">
              <span className="font-medium">Sort by: </span>{' '}
              <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                <HiOutlineChevronUp /> Newest
              </button>
              <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                <HiOutlineChevronDown /> Oldest
              </button>
              <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                <HiOutlineLightningBolt /> Popular
              </button>
            </div>
            <div>
              {postsQuery.loading ? (
                <div className="flex justify-around w-full pt-24">
                  <Loading color="#000000" size="xl" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postsQuery.data?.posts
                    .filter((post) => post.photos[0]?.hash)
                    .map((post) => {
                      return (
                        <Link // this will eventually open the modal with the photo
                          href={`/post/${post.id}`}
                          key={post.id}
                          passHref
                        >
                          <div className="flex flex-col w-full h-64 text-left bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm">
                            {post.photos && (
                              <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                                <Image
                                  src={UrlPrefix + post.photos[0].hash}
                                  layout="fill"
                                  objectFit="cover"
                                  objectPosition="center"
                                  className="rounded-t-lg"
                                  alt=""
                                  quality={60}
                                />
                              </div>
                            )}
                            <div className="px-4 py-2">
                              <Link
                                href={`/user/${post.author.username}`}
                                passHref
                              >
                                <h2 className="text-lg font-medium cursor-pointer">
                                  {post.author.firstName} {post.author.lastName}
                                </h2>
                              </Link>
                              <h3
                                className="text-gray-600"
                                style={{ fontSize: '12px' }}
                              >
                                {post.description}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Place;
