import { MapContext } from '@src/contexts/MapContext';
import { ConvertBounds, GetMapStyle } from '@src/functions/map';
import { IViewport, MapStyles } from '@src/types/map';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { ExtraState, MapRef } from 'react-map-gl';

import { Maybe } from '../../../../../.cache/__types__';
import { FetchMore, MapStyleMenu, SearchLocation } from './index';
import Clusters from './markers/Clusters';
import { TimeLine } from './timeLine';
import Router from 'next/router';

const Map: React.FC = () => {
  const mapContext = React.useContext(MapContext); // get map context
  const [mapStyle, setMapStyle] = useState<MapStyles>('theme'); // possible map styles, defaults to theme
  const { resolvedTheme } = useTheme(); // get current theme
  const mapRef = useRef<Maybe<MapRef>>(null); // map ref to get map instance

  useEffect(() => {
    Router.replace({
      pathname: '/',
      query: {
        lat: mapContext.viewport.latitude.toFixed(4),
        lng: mapContext.viewport.longitude.toFixed(4),
        zoom: mapContext.viewport.zoom.toFixed(4),
        place: mapContext.sidebarPlace,
        minYear: mapContext.timeLimitation[0],
        maxYear: mapContext.timeLimitation[1],
      },
    });
  }, [
    mapContext.bounds,
    mapContext.sidebarPlace,
    mapContext.timeLimitation,
    mapContext.timeLimitation,
  ]);

  return (
    <>
      {/* MAP */}
      <ReactMapGL
        latitude={mapContext.viewport.latitude}
        longitude={mapContext.viewport.longitude}
        zoom={mapContext.viewport.zoom}
        width="100%"
        height="100%"
        className="relative rounded-lg"
        mapStyle={GetMapStyle(mapStyle, resolvedTheme)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onViewportChange={(viewport: IViewport) =>
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
        <Clusters mapRef={mapRef} />
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
