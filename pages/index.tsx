import {
  defaultValues,
  MapContext,
} from '@components/Templates/Map/MapContext';
import MapGL from '@components/Templates/Map/MapWindow';
import RightPanel from '@components/Templates/Map/RightPanel/RightPanel';
import { usePlacesQuery } from '@graphql/geo.graphql';
import { usePostsQuery } from '@graphql/post.graphql';
import Viewport from '@lib/types/viewport';
import { AnimatePresence, motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

import { Maybe } from '../.cache/__types__';
import ArrowIcon from '../components/Elements/Icons/ArrowIcon';
import { Layout } from '../components/Layouts';
import { TimeLine } from '../components/Modules/TimeLine';

export type SidebarPlaceType = {
  id: number;
  name?: string | null;
  longitude: number;
  latitude: number;
  icon?: string | null;
  preview?: Maybe<{
    hash: string;
    blurhash: string;
    width: number;
    height: number;
  }>;
  description?: Maybe<string>;
};

const Map: React.FC<{
  lat?: number;
  lng?: number;
  zoom?: number;
  place?: number;
}> = ({ lat, lng, zoom, place }) => {
  const [bounds, setBounds] = useState(defaultValues.bounds);

  const placesQuery = usePlacesQuery({
    variables: {
      input: {
        filter: { take: 25 },
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

  const [hoverPlaceId, setHoverPlaceId] = useState<number | null>(null);
  const [whatToShow, setWhatToShow] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getFullYear(),
  ]);

  const [sidebarPlace, setSidebarPlace] =
    useState<Maybe<SidebarPlaceType>>(null);

  // map viewport
  const [viewport, setViewport] = useState<Viewport>({
    ...defaultValues.viewport,
    latitude: lat || defaultValues.viewport.latitude,
    longitude: lng || defaultValues.viewport.longitude,
    zoom: zoom || defaultValues.viewport.zoom,
  });

  return (
    <Layout
      head={{
        title: `Map | HiStories`,
        description: `HiStorical map of the world with stories and timeline`,
        canonical: 'https://www.histories.cc/',
        openGraph: {
          title: `Map | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/',
          description: `HiStorical map of the world with stories and timeline`,
          site_name: 'Map',
        },
      }}
    >
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
          timeLimitation,
          setTimeLimitation,
          placesQuery,
          postsQuery,
          hoverPlaceId,
          setHoverPlaceId,
          showSidebar,
          setShowSidebar,
        }}
      >
        <div
          className="w-full bg-[#FAFBFB] dark:bg-[#171716]"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          <AnimatePresence>
            <motion.section
              className={`w-full grid ${
                showSidebar
                  ? 'grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1'
                  : 'grid-cols-1 grid-rows-1'
              } transition-all duration-500 ease-in-out h-screen`}
              transition={{
                delay: !showSidebar ? 0 : 0.5,
                duration: 0.25,
                ease: 'easeInOut',
              }}
            >
              <div className="relative w-full p-2 col-span-1">
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
                  <TimeLine domain={[1000, new Date().getFullYear()]} />
                </div>
                <MapGL />
              </div>
              <RightPanel />
            </motion.section>
          </AnimatePresence>
        </div>
      </MapContext.Provider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.url?.startsWith('_next')) return { props: {} };

  return {
    props: ctx.query,
  };
};

export default Map;
