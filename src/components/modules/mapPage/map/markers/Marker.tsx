import { PhotoMarkerIcon } from '@components/icons';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import Image from 'next/image';
import React, { useState } from 'react';
import { Marker as MapGLMarker } from 'react-map-gl';

interface MarkerProps {
  place: {
    id: number;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview: string;
    isCluster: boolean;
  };
  onClick?: () => void;
  numberOfPlaces?: number;
}

const Marker: React.FC<MarkerProps> = ({ place, onClick, numberOfPlaces }) => {
  const mapContext = React.useContext(MapContext);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const hasIcon = place.icon != null;
  const preview =
    UrlPrefix + (place.icon !== null ? place.icon : place.preview);

  return (
    <MapGLMarker latitude={place.latitude} longitude={place.longitude}>
      <div className="relative">
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 
              ${hasIcon ? 'w-24 h-24' : 'w-16 h-16'}
              ${
                hasIcon
                  ? 'border-transparent'
                  : mapContext.hoverPlaceId === place.id
                  ? 'border-brand'
                  : 'border-white'
              }`}
          onMouseEnter={() =>
            !place.isCluster && mapContext.setHoverPlaceId(place.id)
          }
          onMouseLeave={() =>
            !place.isCluster && mapContext.setHoverPlaceId(null)
          }
          onClick={onClick}
        >
          {/* PLACE COUNT IN CORNER */}
          {numberOfPlaces && numberOfPlaces > 1 && (
            <div
              className={`absolute ${
                loadingImage ? 'top-0 right-0' : '-top-2 -right-2'
              } w-6 h-6 text-white text-center bg-brand rounded-full z-20`}
            >
              {numberOfPlaces}
            </div>
          )}

          {/* PLACE ICON/PREVIEW */}
          {loadingImage && ( // if image is loading show universal place icon
            <div className="p-4 text-brand">
              <PhotoMarkerIcon />
            </div>
          )}
          <Image
            src={preview}
            layout={hasIcon ? undefined : 'fill'}
            width={hasIcon ? 90 : undefined}
            height={hasIcon ? 90 : undefined}
            className={hasIcon ? '' : 'p-4 rounded-full'}
            objectFit={hasIcon ? 'contain' : 'cover'}
            objectPosition={hasIcon ? undefined : 'center'}
            alt={'Place'}
            quality={10}
            onLoadingComplete={() => setLoadingImage(false)}
          />
        </div>
      </div>
    </MapGLMarker>
  );
};

export default Marker;
