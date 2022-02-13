import { ConvertBounds, GetMapStyle } from '@src/functions/map';
import { IViewport, MapStyles } from '@src/types/map';
import { useTheme } from 'next-themes';
import React, { useRef, useState } from 'react';
import ReactMapGL, { ExtraState, MapRef } from 'react-map-gl';
import useSupercluster from 'use-supercluster';

import { Maybe } from '../../../../../.cache/__types__';
import { MapContext } from '@src/contexts/MapContext';
import {
  Clusters,
  FetchMore,
  GetPoints,
  MapStyleMenu,
  SearchLocation,
} from './index';
import { TimeLine } from './timeLine';

const Map: React.FC = () => {
  const mapContext = React.useContext(MapContext); // get map context
  const [mapStyle, setMapStyle] = useState<MapStyles>('theme'); // possible map styles, defaults to theme
  const { resolvedTheme } = useTheme(); // get current theme
  const mapRef = useRef<Maybe<MapRef>>(null); // map ref to get map instance

  const { clusters, supercluster } = useSupercluster({
    points:
      GetPoints({
        timeLimitation: mapContext.timeLimitation,
        places: mapContext.placesQuery?.data?.places,
      }) ?? [],
    zoom: mapContext.viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  }); // get clusters

  return (
    <>
      {/* MAP */}
      <ReactMapGL
        {...mapContext.viewport}
        width="100%"
        height="100%"
        className="relative rounded-lg"
        mapStyle={GetMapStyle(mapStyle, resolvedTheme)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onViewportChange={(viewport: React.SetStateAction<IViewport>) =>
          mapContext.setViewport(viewport)
        }
        onInteractionStateChange={async (state: ExtraState) => {
          if (!state.isDragging) {
            // if user is not currently dragging
            if (mapRef.current) {
              // and if map ref exists
              const bounds = ConvertBounds(mapRef.current.getMap().getBounds());
              mapContext.setBounds(bounds);
              FetchMore({ mapContext, bounds });
            }
          }
        }}
        ref={(instance) => (mapRef.current = instance)}
      >
        {/* CLUSTERS AND PLACES ON MAP */}
        <Clusters
          clusters={clusters}
          supercluster={supercluster}
          mapContext={mapContext}
        />
      </ReactMapGL>
      {/* SEARCH */}
      <div className="absolute z-40 top-4 left-4 w-96">
        <SearchLocation
          viewport={mapContext.viewport}
          setViewport={mapContext.setViewport}
        />
      </div>

      {/* MAP STYLE */}
      <div className="absolute z-40 right-2 bottom-2">
        <MapStyleMenu
          setMapStyle={setMapStyle}
          viewport={mapContext.viewport}
        />
      </div>

      {/* TIME LINE */}
      <div className="absolute bottom-0 left-0 z-20 px-8 pt-2 w-[28vw]">
        <TimeLine domain={[1000, new Date().getFullYear()]} />
      </div>
    </>
  );
};

export default Map;
