import { LayersIcon } from '@components/Modules/Minimap/icons';
import { Menu } from '@headlessui/react';
import { ConvertBounds } from '@lib/functions';
import Viewport from '@lib/types/viewport';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useRef } from 'react';
import ReactMapGL, { ExtraState, MapRef, Marker } from 'react-map-gl';
import UrlPrefix from 'shared/config/UrlPrefix';
import Bounds from 'types/Bounds';

import { Maybe } from '../../../.cache/__types__';
import { Dark, Light, Satellite } from '../../../shared/config/MapStyles';
import { MapContext } from './MapContext';

type MapGLProps = {
  // eslint-disable-next-line no-unused-vars
  onMove?: (bounds: Bounds) => void;
};

async function OnMove(
  mapRef: React.MutableRefObject<Maybe<MapRef>>,
  // eslint-disable-next-line no-unused-vars
  onMove?: (bounds: Bounds) => void
) {
  // if onMove function is not undefined
  if (mapRef.current && onMove) {
    const bounds = ConvertBounds(mapRef.current.getMap().getBounds());
    await onMove(bounds);
  }
}

const MapGL: React.FC<MapGLProps> = ({ onMove }) => {
  const mapContext = React.useContext(MapContext);

  const [mapStyle, setMapStyle] = React.useState<
    'theme' | 'light' | 'dark' | 'satellite'
  >('theme');

  const { resolvedTheme } = useTheme();

  const mapRef = useRef<Maybe<MapRef>>(null);

  const mapProps = {
    width: '100%',
    height: '100%',
    className: 'rounded-lg',
    mapStyle:
      // default map style by theme
      mapStyle === 'theme'
        ? resolvedTheme === 'dark'
          ? Dark
          : Light
        : // explicit map styles
        mapStyle === 'dark'
        ? Dark
        : mapStyle === 'satellite'
        ? Satellite
        : Light,
    mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
  };

  const mapFunctions = {
    onViewportChange: (viewport: React.SetStateAction<Viewport>) =>
      mapContext.setViewport(viewport),
    // OnMove triggers
    onLoad: async () => OnMove(mapRef, onMove),
    onInteractionStateChange: async (state: ExtraState) => {
      if (!state.isDragging) OnMove(mapRef, onMove);
    },
  };

  return (
    <ReactMapGL
      {...mapContext.viewport}
      {...mapProps}
      {...mapFunctions}
      ref={(instance) => (mapRef.current = instance)}
    >
      {mapContext.placesQuery?.data?.places
        .filter((place) => (place.preview || place.icon) && place)
        .map((place) => {
          return (
            <Marker
              key={place.id}
              latitude={place.latitude}
              longitude={place.longitude}
            >
              <div className="relative">
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 ${
                    place.icon ? 'w-24 h-24' : 'w-16 h-16'
                  }
                ${
                  mapContext.hoverPlaceId === place.id && !place.icon
                    ? 'border-black'
                    : 'border-transparent'
                }
                `}
                  onMouseEnter={() => mapContext.setHoverPlaceId(place.id)}
                  onMouseLeave={() => mapContext.setHoverPlaceId(null)}
                  onClick={() => mapContext.setSidebarPlace(place)}
                >
                  {place.icon ? (
                    <Image
                      src={UrlPrefix + place.icon}
                      width={90}
                      height={90}
                      objectFit="contain"
                      alt="Picture on map"
                      quality={10}
                    />
                  ) : (
                    <Image
                      // @ts-ignore
                      src={UrlPrefix + place.preview[0]}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-full"
                      alt="Picture on map"
                    />
                  )}
                </div>
              </div>
            </Marker>
          );
        })}

      <div className="absolute z-40 right-2 bottom-2">
        <Menu>
          <Menu.Button
            as="button"
            className="flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl"
          >
            <LayersIcon className="w-8 h-8 p-2 text-black rounded-lg" />
          </Menu.Button>
          <Menu.Items
            as="div"
            className="absolute right-0 z-50 flex flex-row p-2 bg-white border border-gray-200 rounded-lg gap-2 -mt-9 transform -translate-y-full dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
          >
            <button
              className="block w-20 h-20 rounded"
              onClick={() => setMapStyle('light')}
            >
              <ReactMapGL
                {...{
                  ...mapContext.viewport,
                  zoom: mapContext.viewport.zoom - 4,
                }}
                width="100%"
                height="100%"
                className="rounded-lg"
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
                mapStyle={Light}
              />
            </button>
            <button
              className="block w-20 h-20"
              onClick={() => setMapStyle('dark')}
            >
              <ReactMapGL
                {...{
                  ...mapContext.viewport,
                  zoom: mapContext.viewport.zoom - 4,
                }}
                width="100%"
                height="100%"
                className="rounded-lg"
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
                mapStyle={Dark}
              />
            </button>
            <button
              className="block w-20 h-20"
              onClick={() => setMapStyle('satellite')}
            >
              <ReactMapGL
                {...{
                  ...mapContext.viewport,
                  zoom: mapContext.viewport.zoom - 4,
                }}
                width="100%"
                height="100%"
                className="rounded-lg"
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
                mapStyle={Satellite}
              />
            </button>
          </Menu.Items>
        </Menu>
      </div>
    </ReactMapGL>
  );
};

export default MapGL;
