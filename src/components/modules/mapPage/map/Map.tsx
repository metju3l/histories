import { Dialog } from '@headlessui/react';
import { MapContext } from '@src/contexts/MapContext';
import MeContext from '@src/contexts/MeContext';
import { ConvertBounds, GetMapStyle } from '@src/functions/map';
import { IViewport, MapStyles } from '@src/types/map';
import Link from 'next/link';
import Router from 'next/router';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ReactMapGL, { ExtraState, MapEvent, MapRef } from 'react-map-gl';

import { Maybe } from '../../../../../.cache/__types__';
import { FetchMore, MapStyleMenu, SearchLocation } from './index';
import Clusters from './markers/Clusters';
import { TimeLine } from './timeLine';

const Map: React.FC = () => {
  const mapContext = React.useContext(MapContext); // get map context
  const meContext = React.useContext(MeContext); // get me context
  const { t } = useTranslation<string>();
  const [mapStyle, setMapStyle] = useState<MapStyles>('theme'); // possible map styles, defaults to theme
  const { resolvedTheme } = useTheme(); // get current theme
  const mapRef = useRef<Maybe<MapRef>>(null); // map ref to get map instance
  const [contextMenu, setContextMenu] =
    useState<
      Maybe<{ screenPosition: [number, number]; coordinates: [number, number] }>
    >(null); // context menu position

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
        ref={(instance) => (mapRef.current = instance)}
        /* ON RIGHT MOUSE CLICK */
        onContextMenu={(evt: MapEvent) => {
          evt.preventDefault(); // prevent default context menu
          setContextMenu({
            coordinates: evt.lngLat,
            screenPosition: [evt.center.x, evt.center.y],
          }); // set context menu position
        }}
        /* ON VIEWPORT CHANGE */
        onViewportChange={(viewport: IViewport) =>
          mapContext.setViewport(viewport)
        }
        /* ON INTERACTION */
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
      >
        {/* CLUSTERS AND PLACES ON MAP */}
        <Clusters mapRef={mapRef} />
      </ReactMapGL>

      {/* CONTEXT MENU */}
      <Dialog
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        className={`absolute z-40 py-2 bg-white rounded-xl shadow-md`}
        style={{
          left: contextMenu?.screenPosition[0],
          top: contextMenu?.screenPosition[1],
        }}
      >
        <Dialog.Overlay />
        <div className="flex flex-col">
          {/* COORDINATES */}
          <button
            className="px-4 py-1 hover:bg-gray-100"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${contextMenu?.coordinates[0]}, ${contextMenu?.coordinates[1]}`
              );
              toast.success(t('coordinates_copied'));
            }}
          >{`${contextMenu?.coordinates[0].toFixed(
            5
          )}, ${contextMenu?.coordinates[1].toFixed(5)}`}</button>
          {/* CREATE POST */}
          {meContext.data?.me && (
            <Link
              href={`/create/post?lat=${contextMenu?.coordinates[0]}&lng=${contextMenu?.coordinates[1]}`}
              passHref
            >
              <button className="px-4 py-1 hover:bg-gray-100">
                Add photo of this place
              </button>
            </Link>
          )}
          {/* SHOW NEARBY */}
          <button className="px-4 py-1 hover:bg-gray-100">
            Show nearby places
          </button>
        </div>
      </Dialog>

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
      <div className="absolute left-0 z-20 h-full px-8 pt-2 bottom-4 max-h-64 w-[28vw]">
        <TimeLine />
      </div>
    </>
  );
};

export default Map;
