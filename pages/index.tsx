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
import { useTranslation } from 'react-i18next';

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
  lat: number | null;
  lng: number | null;
  zoom: number | null;
  minDate: number | null;
  maxDate: number | null;
  place?: number;
}> = ({ lat, lng, zoom, minDate, maxDate }) => {
  const { t } = useTranslation<string>();
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
            {/* MAIN GRID */}
            <motion.section
              className={`w-full h-full grid ${
                showSidebar
                  ? 'grid-cols-1 grid-rows-2 lg:grid-cols-[auto_48.25em] xl:grid-cols-[auto_62.25em] md:grid-cols-[auto_32.25em] md:grid-rows-1'
                  : 'grid-cols-1 grid-rows-1'
              } `}
              transition={{
                delay: !showSidebar ? 0 : 0.5,
                duration: 0.25,
                ease: 'easeInOut',
              }}
            >
              {/* MAP */}
              <div className="relative w-full h-full p-2 col-span-1">
                {/* SEARCH */}
                {/*   <div className="absolute left-4 z-40 top-4 w-96 flex rounded-lg bg-white items-center px-4">
                  <input
                    className="w-full h-12 text-lg font-medium placeholder-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
                    placeholder={t('search_place')}
                  />
                  <button>
                    <HiSearch className="h-8 w-8 text-gray-300" />
                  </button>
                </div>
              */}

                {/* HIDE SIDEBAR ARROW ICON */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="absolute z-50 flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl"
                >
                  <ArrowIcon
                    className={`w-8 py-1 h-8 ${
                      showSidebar ? 'rotate-180' : 'rotate-0'
                    } transition-all duration-500 ease-in-out`}
                  />
                </button>
                <div className="absolute bottom-0 left-0 z-20 px-8 pt-2 w-[28vw]">
                  <TimeLine domain={[1000, new Date().getFullYear()]} />
                </div>
                <MapGL />
              </div>

              {/* RIGHT PANEL */}
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
    props: {
      lat: typeof ctx.query.lat === 'string' ? parseFloat(ctx.query.lat) : null,
      lng: typeof ctx.query.lng === 'string' ? parseFloat(ctx.query.lng) : null,
      zoom:
        typeof ctx.query.zoom === 'string' ? parseFloat(ctx.query.zoom) : null,
      maxTime:
        typeof ctx.query.maxTime === 'string'
          ? parseFloat(ctx.query.maxTime)
          : null,
      minTime:
        typeof ctx.query.minTime === 'string'
          ? parseFloat(ctx.query.minTime)
          : null,
    },
  };
};

export default Map;
