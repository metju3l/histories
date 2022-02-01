import { PhotoMarkerIcon } from '@components/icons';
import MapLayerMenu from '@components/Modules/Map/LayerMenu';
import { ConvertBounds } from '@lib/functions';
import Viewport from '@lib/types/viewport';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useRef, useState } from 'react';
import ReactMapGL, { ExtraState, MapRef, Marker } from 'react-map-gl';
import UrlPrefix from 'shared/config/UrlPrefix';
import Bounds from 'types/Bounds';
import useSupercluster from 'use-supercluster';

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
  >('theme'); // possible map styles, defaults to theme

  const { resolvedTheme } = useTheme(); // get current theme

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

  const points = mapContext.placesQuery?.data?.places.map((place) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      id: place.id,
      icon: place.icon,
      preview: place?.preview?.hash,
    },
    geometry: {
      type: 'Point',
      coordinates: [place.longitude, place.latitude],
    },
  }));

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points: points ?? [],
    zoom: mapContext.viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });

  return (
    <ReactMapGL
      {...mapContext.viewport}
      {...mapProps}
      {...mapFunctions}
      ref={(instance) => (mapRef.current = instance)}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        const filteredPlace = mapContext.placesQuery?.data?.places.find(
          (place) => place.id == cluster.id
        );

        return (
          <MapMarker
            key={cluster.id}
            place={{
              id: cluster.id,
              longitude,
              latitude,
              icon: isCluster ? undefined : filteredPlace?.icon, // return icon only if it's place (not cluster)
              preview: {
                hash:
                  filteredPlace?.preview?.hash ?? cluster.properties.preview,
              },
            }}
            numberOfPlaces={pointCount}
            onClick={() => {
              if (!isCluster) {
                // if it's not a cluster open place in sidebar and end function
                mapContext.setSidebarPlace(cluster);
                return;
              }
              // if it's a cluster zoom to see all places
              const expansionZoom = Math.min(
                supercluster.getClusterExpansionZoom(cluster.id),
                20
              );

              mapContext.setViewport({
                ...mapContext.viewport,
                latitude,
                longitude,
                zoom: expansionZoom,
              });
            }}
          />
        );
      })}

      <div className="absolute z-40 right-2 bottom-2">
        <MapLayerMenu
          setMapStyle={setMapStyle}
          viewport={mapContext.viewport}
        />
      </div>
    </ReactMapGL>
  );
};

type MapMarkerProps = {
  place: {
    id: number;
    name?: string | null;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview: {
      hash: string;
    };
  };
  onClick?: () => void;
  numberOfPlaces?: number;
};

const MapMarker: React.FC<MapMarkerProps> = ({
  place,
  onClick,
  numberOfPlaces,
}) => {
  const mapContext = React.useContext(MapContext);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  return (
    <Marker
      key={place.id}
      latitude={place.latitude}
      longitude={place.longitude}
    >
      <div className="relative">
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 
            ${place.icon ? 'w-24 h-24' : 'w-16 h-16'}
            ${
              !place.icon && !loadingImage
                ? 'border-white hover:border-brand'
                : 'border-transparent'
            }`}
          onMouseEnter={() => mapContext.setHoverPlaceId(place.id)}
          onMouseLeave={() => mapContext.setHoverPlaceId(null)}
          onClick={onClick}
        >
          {place.icon ? (
            // if place has an icon
            <Image
              src={UrlPrefix + place.icon}
              width={90}
              height={90}
              objectFit="contain"
              alt="Picture on map"
              quality={10}
            />
          ) : place.preview.hash ? (
            // else show preview image of place
            <>
              {loadingImage && ( // if image is loading show universal place icon
                <div className="p-4 text-brand">
                  <PhotoMarkerIcon />
                </div>
              )}
              {numberOfPlaces !== undefined &&
                numberOfPlaces > 1 && ( // if marker is a cluster
                  <div
                    className={`absolute ${
                      loadingImage ? 'top-0 right-0' : '-top-2 -right-2'
                    } w-6 h-6 text-white text-center bg-brand rounded-full z-20`}
                  >
                    {numberOfPlaces}
                  </div>
                )}

              <Image
                src={UrlPrefix + place.preview.hash}
                placeholder="empty"
                layout="fill"
                onLoadingComplete={() => setLoadingImage(false)}
                objectFit="cover"
                objectPosition="center"
                className="p-4 rounded-full"
                alt="Picture on map"
              />
            </>
          ) : (
            <div className="p-4 text-brand">
              <PhotoMarkerIcon />
            </div>
          )}
        </div>
      </div>
    </Marker>
  );
};

export default MapGL;
