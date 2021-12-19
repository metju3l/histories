import { PlacesQuery } from '@graphql/geo.graphql';
import Viewport from '@lib/types/viewport';
import Image from 'next/image';
import { MapContext } from 'pages/map';
import React, { useRef } from 'react';
import ReactMapGL, { ExtraState, MapRef, Marker } from 'react-map-gl';
import Bounds from 'types/Bounds';

import { Maybe } from '../../.cache/__types__';

type MapGLProps = {
  data: PlacesQuery | undefined;
  onMove?: (bounds: Bounds) => void;
};

function ConvertBounds(bounds: {
  _ne: { lat: number; lng: number };
  _sw: { lat: number; lng: number };
}): Bounds {
  return {
    maxLatitude: bounds._ne.lat,
    minLatitude: bounds._sw.lat,
    maxLongitude: bounds._ne.lng,
    minLongitude: bounds._sw.lng,
  };
}

async function OnMove(
  mapRef: React.MutableRefObject<Maybe<MapRef>>,
  onMove?: (bounds: Bounds) => void
) {
  // if onMove function is not undefined
  if (mapRef.current && onMove) {
    const bounds = ConvertBounds(mapRef.current.getMap().getBounds());
    await onMove(bounds);
  }
}

const MapGL: React.FC<MapGLProps> = ({ data, onMove }) => {
  const mapContext = React.useContext(MapContext);

  const mapRef = useRef<Maybe<MapRef>>(null);

  const mapProps = {
    width: '100%',
    height: '100%',
    className: 'rounded-lg',
    mapStyle: 'mapbox://styles/mapbox/streets-v11', // MAPBOX STYLE
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
      {data?.places
        .filter((place) => (place.preview || place.icon) && place)
        .map((place) => {
          return (
            <Marker
              key={place.id}
              latitude={place.latitude}
              longitude={place.longitude}
            >
              <div
                onClick={() => mapContext.setSidebarPlace(place)}
                className="cursor-pointer -translate-y-1/2 -translate-x-1/2"
              >
                {place.icon ? (
                  <Image
                    src={place.icon}
                    width={90}
                    height={90}
                    objectFit="contain"
                    alt="Picture on map"
                    quality={10}
                  />
                ) : (
                  <Image
                    // @ts-ignore
                    src={place.preview[0]}
                    width={60}
                    height={60}
                    className="object-cover rounded-full"
                    alt="Picture on map"
                  />
                )}
              </div>
            </Marker>
          );
        })}
    </ReactMapGL>
  );
};

export default MapGL;
