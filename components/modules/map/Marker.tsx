import { PhotoMarkerIcon } from '@components/icons';
import { MapContext } from '@components/templates/map/MapContext';
import Image from 'next/image';
import React, { useState } from 'react';
import { Marker as MapGLMarker } from 'react-map-gl';

import UrlPrefix from '../../../shared/config/UrlPrefix';

interface MarkerProps {
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
}

const Marker: React.FC<MarkerProps> = ({ place, onClick, numberOfPlaces }) => {
  const mapContext = React.useContext(MapContext);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  return (
    <MapGLMarker
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
    </MapGLMarker>
  );
};

export default Marker;
