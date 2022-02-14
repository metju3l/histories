import { Loading } from '@components/elements';
import { useMapSidebarPlaceQuery } from '@graphql/queries/place.graphql';
import { useMapSidebarPostsQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface PlaceProps {
  id: number;
}

const Place: React.FC<PlaceProps> = ({ id }) => {
  const mapContext = React.useContext(MapContext); // get map context
  const { t } = useTranslation<string>();
  const placeQuery = useMapSidebarPlaceQuery({
    variables: { id },
  }); // get place data
  const postsQuery = useMapSidebarPostsQuery({
    variables: { input: { filter: { placeId: id } } },
  }); // get place posts

  return (
    <div className="w-full">
      <div className="text-center">
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
        </div>
        <button
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
          Show on map
        </button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(
              `https://www.histories.cc/?lat=${placeQuery.data?.place.latitude}&lng=${placeQuery.data?.place.longitude}&zoom=19&place=${mapContext.sidebarPlace}`
            );
            toast.success(t('link_copied'));
          }}
        >
          Share
        </button>
        <Link href={`/create/post?place=${mapContext.sidebarPlace}`} passHref>
          <button>Add photo</button>
        </Link>

        <p className="pt-4 text-left">{placeQuery.data?.place.description}</p>

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
                  <div
                    key={post.id}
                    className="flex flex-col w-full h-64 text-left bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
                  >
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
                      <Link href={`/user/${post.author.username}`} passHref>
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
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Place;
