import { usePlacesQuery } from '@graphql/queries/place.graphql';
import { usePostsQuery } from '@graphql/queries/post.graphql';
import {
  boundsPlaceholder,
  viewportPlaceholder,
} from '@lib/constants/MapPlaceholderValues';
import { IViewport } from '@lib/types/map';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarPlaceType } from 'pages';
import React, { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

import { MapContext } from '../../lib/contexts/MapContext';
import Map from '../modules/map/Map';
import RightPanel from './map/rightPanel/RightPanel';
import { Maybe } from '.cache/__types__';

interface MapTemplateProps {
  lat: Maybe<number>;
  lng: Maybe<number>;
  zoom: Maybe<number>;
  minDate: Maybe<number>;
  maxDate: Maybe<number>;
  place: Maybe<number>;
}

const MapTemplate: React.FC<MapTemplateProps> = ({
  lat,
  lng,
  zoom,
  minDate,
  maxDate,
  place,
}) => {
  const [bounds, setBounds] = useState(boundsPlaceholder); // viewport bounds

  const placesQuery = usePlacesQuery({
    variables: {
      input: {
        filter: { take: 25 },
      },
    },
  }); // places query

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  }); // posts query

  const [hoverPlaceId, setHoverPlaceId] = useState<number | null>(null); // place id on hover
  const [whatToShow, setWhatToShow] = useState<'places' | 'photos'>('places'); // what to show on the right panel
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // is sidebar visible
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getFullYear(),
  ]);

  const [sidebarPlace, setSidebarPlace] =
    useState<Maybe<SidebarPlaceType>>(null);

  // map viewport
  const [viewport, setViewport] = useState<IViewport>({
    ...viewportPlaceholder,
    latitude: lat || viewportPlaceholder.latitude,
    longitude: lng || viewportPlaceholder.longitude,
    zoom: zoom || viewportPlaceholder.zoom,
  });

  return (
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
          >
            {/* LEFT PANEL */}
            <div className="relative w-full h-full p-2 col-span-1">
              {/* HIDE SIDEBAR ARROW ICON */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute z-50 flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl"
              >
                <HiOutlineChevronLeft
                  className={`w-8 py-1 h-8 transition-all duration-500 ease-in-out ${
                    showSidebar ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
              {/* MAP */}
              <Map />
            </div>

            {/* RIGHT PANEL */}
            <RightPanel />
          </motion.section>
        </AnimatePresence>
      </div>
    </MapContext.Provider>
  );
};

export default MapTemplate;
