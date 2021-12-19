import MapGL from '@components/Map/MapWindow';
import { Loading } from '@components/UI';
import { usePlacesQuery } from '@graphql/geo.graphql';
import { usePostsQuery } from '@graphql/post.graphql';
import Viewport from '@lib/types/viewport';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Bounds from 'types/Bounds';

import { Maybe } from '../.cache/__types__';
import ArrowIcon from '../components/Icons/ArrowIcon';
import { Layout } from '../components/Layout';
import SubNav from '../components/Map/SubNav';
import { TimeLine } from '../components/TimeLine';

const defaultValues = {
  bounds: {
    minLatitude: 0,
    maxLatitude: 0,
    minLongitude: 0,
    maxLongitude: 0,
  },
  viewport: {
    latitude: 50,
    longitude: 15.1,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
};

export type SidebarPlaceType = {
  id: number;
  name?: string | null;
  longitude: number;
  latitude: number;
  icon?: string | null;
  preview?: string[] | null;
  description?: Maybe<string>;
};

type MapContextType = {
  bounds: Bounds;
  setBounds: React.Dispatch<React.SetStateAction<Bounds>>;
  whatToShow: Maybe<string>;
  setWhatToShow: React.Dispatch<React.SetStateAction<Maybe<string>>>;
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  sidebarPlace: Maybe<SidebarPlaceType>;
  setSidebarPlace: React.Dispatch<
    React.SetStateAction<Maybe<SidebarPlaceType>>
  >;
};

export const MapContext = React.createContext<MapContextType>({
  bounds: defaultValues.bounds,
  setBounds: () => {},
  whatToShow: 'places',
  setWhatToShow: () => {},
  viewport: defaultValues.viewport,
  setViewport: () => {},
  sidebarPlace: null,
  setSidebarPlace: () => {},
});

const Map: React.FC = () => {
  const router = useRouter();
  const [bounds, setBounds] = useState(defaultValues.bounds);
  const { data, loading, error, fetchMore } = usePlacesQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  async function FetchMore() {
    if (loading || postsQuery.loading) return 0;

    // fetch more data when map view changes
    if (whatToShow === 'photos')
      await postsQuery.refetch({
        input: {
          filter: bounds,
        },
      });
    else
      await fetchMore({
        variables: {
          input: {
            filter: {
              ...bounds,
              // exclude just places in bounds
              exclude: data?.places
                ? data.places
                    .filter(
                      (place) =>
                        place.latitude > bounds.minLatitude &&
                        place.latitude < bounds.maxLatitude &&
                        place.longitude > bounds.minLongitude &&
                        place.longitude < bounds.maxLongitude
                    )
                    .map((place) => place.id)
                : [],
            },
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            ...previousResult,
            // Add the new matches data to the end of the old matches data.
            places: [
              ...previousResult.places,
              ...(fetchMoreResult?.places ?? []),
            ],
          };
        },
      });
  }

  const [whatToShow, setWhatToShow] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sortBy, setSortBy] = useState('Hot');
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getTime(),
  ]);

  const [sidebarPlace, setSidebarPlace] =
    useState<Maybe<SidebarPlaceType>>(null);

  // map viewport
  const [viewport, setViewport] = useState<Viewport>(defaultValues.viewport);

  useEffect(() => {
    FetchMore();
  }, [whatToShow]);

  return (
    <Layout title="map | hiStories">
      <MapContext.Provider
        value={{
          bounds,
          setBounds,
          whatToShow,
          setWhatToShow,
          viewport,
          setViewport,
          sidebarPlace,
          setSidebarPlace,
        }}
      >
        <div className="w-full">
          <AnimatePresence>
            <motion.section
              className="w-full grid"
              initial={{
                gridTemplateColumns: '1fr 1fr',
              }}
              animate={{
                gridTemplateColumns: showSidebar ? '1fr 1fr' : '1fr 0fr',
              }}
              transition={{
                delay: !showSidebar ? 0 : 0.5,
                duration: 0.25,
                ease: 'easeInOut',
              }}
              style={{
                height: 'calc(100vh - 56px)',
              }}
            >
              <div className="relative w-full p-2 bg-white col-span-1">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="absolute z-50 flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl"
                >
                  <motion.span
                    animate={{ rotate: showSidebar ? '180deg' : '0deg' }}
                    transition={{
                      delay: 0.3,
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowIcon className={'w-8 py-1 h-8'} />
                  </motion.span>
                </button>
                <div className="absolute right-0 z-20 px-8 pt-2 w-[28vw]">
                  <TimeLine
                    domain={[1000, new Date().getFullYear()]}
                    setTimeLimitation={setTimeLimitation}
                  />
                </div>
                <MapGL
                  data={data}
                  onMove={async (bounds) => {
                    setBounds(bounds);
                    FetchMore();
                  }}
                />
              </div>
              <div id="leftcol" className="relative h-full">
                {showSidebar && (
                  <motion.div
                    initial={{ opacity: 0, display: 'none' }}
                    animate={{ opacity: 1, display: 'block' }}
                    exit={{ opacity: 0, display: 'none' }}
                    transition={{
                      delay: showSidebar ? 1 : 0,
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <SubNav sortBy={sortBy} setSortBy={setSortBy} />
                    <div
                      className={`p-4 pt-8 overflow-y-auto text-black bg-white ${
                        sidebarPlace
                          ? ''
                          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      }`}
                      style={{ height: 'calc(100vh - 123px)' }}
                    >
                      {sidebarPlace === null ? (
                        whatToShow === 'photos' ? (
                          postsQuery.data?.posts.map((post: any) => {
                            return (
                              <motion.div
                                key={post.id}
                                className="flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  duration: 0.5,
                                  ease: 'easeInOut',
                                }}
                              >
                                {post.url && (
                                  <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                                    <Image
                                      src={post.url[0]}
                                      layout="fill"
                                      objectFit="cover"
                                      objectPosition="center"
                                      className="rounded-t-lg"
                                      alt="Profile picture"
                                    />
                                  </div>
                                )}
                                <div className="px-4 py-2">
                                  <h3
                                    className="text-gray-600"
                                    style={{ fontSize: '12px' }}
                                  >
                                    {post?.description?.substring(0, 35)}...
                                  </h3>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          data?.places
                            .filter(
                              (place) =>
                                place.latitude > bounds.minLatitude &&
                                place.latitude < bounds.maxLatitude &&
                                place.longitude > bounds.minLongitude &&
                                place.longitude < bounds.maxLongitude
                            )
                            .map(
                              (place) =>
                                place.preview && (
                                  <MapPostCard
                                    // @ts-ignore
                                    place={place}
                                    setSidebarPlace={setSidebarPlace}
                                  />
                                )
                            )
                        )
                      ) : (
                        <PlaceDetail sidebarPlace={sidebarPlace} />
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </MapContext.Provider>
    </Layout>
  );
};

const MapPostCard: React.FC<{
  place: {
    id: number;
    name?: string | null;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview?: string[] | null;
    description?: string;
  };
  setSidebarPlace: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name?: string | null | undefined;
      longitude: number;
      latitude: number;
      icon?: string | null | undefined;
      preview?: string[] | null | undefined;
    } | null>
  >;
}> = ({ place, setSidebarPlace }) => {
  return (
    <div
      className="flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
      onClick={() => setSidebarPlace(place)}
    >
      {place.preview && (
        <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
          <Image
            src={place.preview[0]}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-t-lg"
            alt="Profile picture"
          />
        </div>
      )}
      <div className="px-4 py-2">
        <h2 className="text-lg font-medium">{place.name}</h2>
        <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
          {place.description?.substring(0, 35)}...
        </h3>
      </div>
    </div>
  );
};

const PlaceDetail: React.FC<{
  sidebarPlace: SidebarPlaceType;
}> = ({ sidebarPlace }) => {
  const { data, loading, error } = usePostsQuery({
    variables: {
      input: {
        filter: {
          placeId: sidebarPlace.id,
        },
      },
    },
  });

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="relative w-full rounded-lg cursor-pointer h-52 md:h-72 bg-secondary">
          {sidebarPlace.preview && (
            <Image
              src={sidebarPlace.preview[0]}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="bg-gray-100 rounded-lg"
              alt="Profile picture"
            />
          )}

          <div className="absolute bottom-0 left-0 z-20 w-full h-full text-left rounded-lg bg-gradient-to-t from-[#000000ee] via-transparent to-transparent">
            <h1 className="absolute text-white bottom-3 left-3">
              {sidebarPlace.name ?? 'Place detail'}
            </h1>
          </div>
        </div>

        <p className="pt-4 text-left">{sidebarPlace.description}</p>

        {loading ? (
          <div className="flex justify-around w-full pt-24">
            <Loading color="#000000" size="xl" />
          </div>
        ) : error ? (
          <div>error</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.posts.map((post) => {
              return (
                <div
                  key={post.id}
                  className="flex flex-col w-full h-64 text-left bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
                >
                  {post.url && (
                    <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                      <Image
                        src={post.url[0]}
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
                    <h2 className="text-lg font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </h2>
                    <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
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

export default Map;
